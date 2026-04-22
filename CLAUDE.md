# Requirement Refinator

Herramienta de refinamiento de historias de usuario para Product Managers.
Un sistema de agentes analiza las HUs del sprint, genera CAs en Gherkin, tareas técnicas estimadas, riesgos y dependencias, y produce un único dashboard HTML interactivo con HITL -- cumpliendo los estándares **ISO/IEC/IEEE 29148:2018** e **ISO/IEC 25010**.

> **Inspirado en:** JM Agentic Development Kit + ASD-main (ASDD orchestrator pattern)
> **Metodología:** SDD -- Spec-Driven Development con quality gates
> **Normativa aplicada:** ISO/IEC/IEEE 29148:2018 (Requisitos) · ISO/IEC 25010 (Calidad del producto)

---

## 🎯 PUNTO DE ENTRADA DEL ASISTENTE (REGLA CARDINAL)

Cuando el PM invoca `/refinar-sprint <id>`, `/refinar-hu`, `/iterar-refinamiento`, `/generar-informe` o `/generar-specs`, **la ÚNICA acción válida del asistente principal es invocar la skill correspondiente mediante el tool `Skill` en el mismo turno**.

Acción canónica para `/refinar-sprint Sprint-144`:

```
Skill(skill="refinar-sprint", args="Sprint-144")
```

Reglas estrictas:
- **NO** leer HUs manualmente desde el asistente principal.
- **NO** hacer preguntas al PM antes de invocar el skill (el skill pregunta lo mínimo necesario en su Fase 0).
- **NO** replicar el flujo de 5 fases en el asistente principal.
- **NO** invocar directamente `Agent(subagent_type="orchestrator", ...)` desde el asistente — eso es responsabilidad de la skill.
- **NO** cerrar el turno con solo texto anunciando la acción. El tool call del skill va en el **mismo mensaje**.

Si la skill no está registrada:
```
⚠ La skill `refinar-sprint` no aparece en el registry del runtime.
Verifica que existe: `ls .claude/skills/refinar-sprint/SKILL.md`
Si falta, revisa la última sección "Checklist post-refactor" de este CLAUDE.md.
```

**Ningún otro camino es válido.** Si el asistente nota que está por leer un archivo o hacer una pregunta ANTES de invocar el skill, debe detenerse e invocar el skill de una vez.

---

## 🛡 Regla de no-silencio (protección anti-tokenburn)

Si el asistente principal o cualquier agente del pipeline está a punto de cerrar un turno **sin** tool call visible y **sin** mensaje de texto suficiente, DEBE en su lugar emitir un mensaje con este formato:

```
[RR·PAUSE] sin progreso detectado · <causa_intuida> · <acción_sugerida>
```

Ejemplos:
- `[RR·PAUSE] sin progreso · esperando input del PM · ¿confirmamos Sprint-144?`
- `[RR·PAUSE] sin progreso · Skill(refinar-sprint) devolvió "Unknown skill" · ejecuta`ls .claude/skills/refinar-sprint/SKILL.md` para verificar registro`
- `[RR·PAUSE] sin progreso · orchestrator timeout · reintenta con /refinar-sprint <id>`

Reglas:
- Nunca cerrar un turno sin uno de: (a) tool call, (b) texto ≥ 40 chars con valor, o (c) `[RR·PAUSE]`.
- Aplica al asistente principal **Y** a cualquier sub-agente.
- El PM puede buscar `[RR·PAUSE]` en el transcript para detectar ciclos muertos.

---

## ⛓ Regla anti-anuncio sin ejecución (refuerzo del no-silencio)

Cuando el asistente está por anunciar una acción que **requiere un tool call** (`Skill`, `Agent`, `Bash`, `Read`, `Write`, `Edit`), el tool call DEBE ir en el **mismo mensaje del anuncio**.

Patrones prohibidos (todos terminan cerrando turno sin ejecución):

- ❌ "Lanzo el orchestrator ahora." — sin tool call.
- ❌ "Ejecutando las 11 HUs en paralelo." — sin tool call.
- ❌ "Arranco el script de consolidación." — sin tool call.

Patrones correctos:

- ✅ "Lanzando orchestrator." + bloque `<Agent subagent_type="orchestrator">` en la misma respuesta.
- ✅ Tool call directo, sin preámbulo.
- ✅ `[RR·PAUSE] <causa>` si por alguna razón la acción NO se puede ejecutar ahora.

Si el asistente detecta que ya publicó un anuncio sin tool call en un turno previo, en el siguiente turno DEBE:
1. Reconocerlo explícitamente ("El turno anterior anuncié sin ejecutar"), y
2. Emitir el tool call pendiente o un `[RR·PAUSE]` con la causa real.

**Esta regla se refuerza con** `scripts/preflight-check.js` (chequeos automáticos) y los quality gates G3.1/G3.2 de `scripts/consolidate-sprint.js` (validación post-write del HTML).

---

## Principios Arquitectónicos

1. **Contexto se lee UNA VEZ** -- El orquestador lee todos los archivos y pasa el contenido como texto a los agentes. Los agentes nunca leen archivos.
2. **1 agente por HU** -- `hu-full-analyzer` ejecuta los 5 análisis (INVEST, ISO 29148, ISO 25010, Gherkin, Tareas, Riesgos, Dependencias) en una sola invocación. No 5 agentes separados.
3. **Agentes producen DATA, no presentación** -- Los agentes devuelven JSON puro conforme a `hu-calidad.schema.json`. Nunca HTML ni CSS.
4. **1 template HTML fijo** -- `templates/core/sprint-dashboard.html` es un archivo HTML estático con CSS y JS incluidos. Renderiza todo desde `window.__SPRINT_DATA__`.
5. **Sin artefactos intermedios** -- No hay `parciales/*.json`, no hay `<hu-id>.html` individuales, no hay `style.css` ni `script.js` separados. Solo `data.json` + `index.html`.
6. **Eficiencia de invocaciones** -- 1 invocación por HU + 0-1 reintentos por quality gates.
7. **Autocontención del orquestador** -- El orquestador recibe TODO lo que necesita en un único prompt y no vuelve a preguntar al asistente padre. Si algo falta, aborta con `[RR·CKPT] PRE ✗`.
8. **Checkpoints visibles** -- Cada fase emite un `[RR·CKPT]` en texto plano (fuera de tool call) para que el PM vea progreso.
9. **Orquestación adaptativa por tamaño del sprint** -- Ver sección siguiente.

---

## 🎚 Threshold: cuándo usar sub-agente orchestrator vs orquestación directa

**Constante:** `ORCHESTRATOR_HU_THRESHOLD = 5`

| Modo | Cuándo | Cómo | Trade-off |
|---|---|---|---|
| **A** — Sub-agente `orchestrator` | `N_HUs ≤ 5` | La skill delega todas las fases (0→5) al sub-agente con prompt autocontenido. | 1 invocación · encapsulada · pero el sub-agente infla contexto a partir de ~6 HUs. |
| **B** — Orquestación directa desde la skill | `N_HUs > 5` | La skill corre Fase -1/0, lanza N `hu-full-analyzer` en paralelo desde el asistente principal y consolida con `scripts/consolidate-sprint.js`. | Cada analyzer aísla su presupuesto · escala a 15-20 HUs · el asistente debe seguir el contrato sin saltar pasos (ver reglas "Punto de entrada" y "anti-anuncio"). |

### Regla de decisión

```
Fase -1 (preflight OK) → N = count(glob(docs/HUs/<sprint>/*.md))
  if N == 0            → abortar con [RR·CKPT] PRE ✗ · no hay HUs
  if N ≤ 5             → Modo A (sub-agente orchestrator)
  if N > 5             → Modo B (orquestación directa + consolidate-sprint.js)
```

La skill `refinar-sprint` DEBE declarar el modo elegido en un checkpoint visible:

```
[RR·CKPT] Modo B · 11 HUs > threshold (5) · orquestando desde el asistente principal
```

Detalle de Fase -1 a Fase 5, pre-conditions y self-correction triggers: ver [`.claude/agents/orchestrator.md`](.claude/agents/orchestrator.md).

---

## Cómo usar (Flujo del PM)

Flujo end-to-end (pasos 1–9), quick start, comandos disponibles y tabla de scripts utilitarios: ver [README.md — Flujo completo del PM](README.md#-flujo-completo-del-pm-end-to-end) y [README.md — Comandos disponibles](README.md#comandos-disponibles).

Esta sección de CLAUDE.md solo describe lo que Claude debe hacer al recibir un comando (arriba: "Punto de entrada del asistente"). El detalle de UX, tabs del dashboard y fases ASDD vive en el README.

---

## Flujo del orquestador (resumen)

| Fase | Nombre | Output | Checkpoint clave |
|---|---|---|---|
| **-1** | Pre-flight (G0) | — | `[RR·CKPT] PRE ✗ · <motivo>` si falta contexto/HUs/schema/template |
| **0** | Configuración mínima (≤1 pregunta al PM) | `sprint_config` | `[RR·CKPT] Fase 0 ✓ · <sprint-id> · <N> HUs` |
| **1** | Análisis en paralelo (1 `hu-full-analyzer` por HU) | N JSONs | `[RR·CKPT] Fase 1 ✓ · <N> JSONs · <M> quality_gate_failed` |
| **2** | Quality Gates G1–G_SCHEMA | Validaciones | `[RR·CKPT] Fase 2 ✓ · <K> reintentos` |
| **3** | Consolidación | `data.json` | `[RR·CKPT] Fase 3 ✓ · data.json (<X> KB)` |
| **4** | Generación HTML (inyección en template) | `index.html` | `[RR·CKPT] Fase 4 ✓ · index.html (<Y> KB)` |
| **5** | Reporte al PM | Resumen | `[RR·CKPT] Fase 5 · listo` |

Detalle de cada fase, quality gates (G1–G_SCHEMA), pre-conditions, retry policy y self-correction triggers: ver [`.claude/agents/orchestrator.md`](.claude/agents/orchestrator.md).

---

## Agentes

Tabla completa de agentes, roles y normativa aplicada: ver [README.md — Arquitectura de agentes](README.md#arquitectura-de-agentes-v1).

Agentes legacy preservados en `.claude/agents/_legacy/` como referencia — su lógica fue absorbida por `hu-full-analyzer`: `hu-analyzer`, `gherkin-writer`, `task-estimator`, `risk-analyst`, `dependency-mapper`.

Enrichers (`hu-security-enricher`, `hu-integration-enricher`, `hu-data-enricher`, `hu-split-advisor`) diseñados como segunda pasada selectiva pero **no implementados en esta versión**. La lógica base está absorbida por `hu-full-analyzer`. Si se requiere enriquecimiento posterior, crear el archivo del enricher en `.claude/agents/` y añadir la Fase 2.5 correspondiente en `orchestrator.md` antes de referenciarlos.

---

## Estructura de archivos

Árbol completo del proyecto: ver [README.md — Estructura del proyecto](README.md#estructura-del-proyecto).

---

## Reglas del sistema

### Leyenda de tags

Cada regla lleva un tag que indica su naturaleza, cómo se enforza y qué pasa al violarla.

| Tag | Naturaleza | Cómo se enforza | Qué pasa si se viola |
|---|---|---|---|
| `[BLOQUEANTE]` | Precondición, invariante de seguridad o contrato no negociable. | Preflight G0, hook Stop `watchdog-empty-turn.js`, snapshot guard, checks manuales del orquestador. | Aborta el pipeline/turno. **Sin reintento automático** — requiere fix del input o intervención humana. |
| `[GATE]` | Validación automática por quality gate. | `scripts/consolidate-sprint.js` (G1–G4) o `scripts/validate-hu-json.js` (G_SCHEMA). | Reintento con feedback al agente. Si persiste tras N reintentos → HU marcada `quality_gate_failed` y escalada al PM. |
| `[ARQUITECTURA]` | Decisión de diseño del framework. | Revisión en PR; no hay script que la valide en runtime. | Cambiarla requiere **re-diseño**, no re-ejecución. |
| `[ESTILO]` | Convención de formato/UX/observabilidad. | Revisión por el PM, tooltips/heartbeats visibles en el dashboard. | No bloquea el flujo. Se marca como tech-debt de calidad. |

### Reglas v1.0 -- Base

1. `[BLOQUEANTE]` **Sin contexto, sin análisis** -- Si `docs/contexto/` está vacío, pedir al PM que lo complete.
2. `[BLOQUEANTE]` **Sin HUs, sin análisis** -- Verificar que existan archivos `.md` en `docs/HUs/Sprint-X/`.
3. `[ESTILO]` **No inventar información técnica** -- Si no está en el contexto, marcarlo como "No documentado -- requiere confirmación".
4. `[ESTILO]` **Gherkin en español de negocio** -- Sin rutas de API ni IDs técnicos.
5. `[ESTILO]` **Estimaciones justificadas** -- Cada tarea incluye justificación de tiempo.
6. `[ESTILO]` **Preguntas, no suposiciones** -- Cuando falte info crítica, generar preguntas de clarificación.
7. `[ARQUITECTURA]` **1 agente por HU, todos en paralelo** -- hu-full-analyzer hace todo. No 5 agentes separados.
8. `[ARQUITECTURA]` **Output por sprint** -- Cada sprint en `output/Sprint-X/`. No sobreescribir sprints anteriores.
9. `[BLOQUEANTE]` **HUs aprobadas son inmutables** -- En modo iteración, no tocar las aprobadas (snapshot guard).
10. `[BLOQUEANTE]` **Sin spec APROBADO → sin implementación** -- Regla cardinal del SDD.

### Reglas de Cobertura y Calidad

11. `[GATE]` **Refinamiento AÑADE, nunca RESTA** -- data.json contiene TODA la información del fuente + el análisis.
12. `[GATE]` **Validación de cobertura obligatoria** -- Comparar sección por sección el original vs refinado.
13. `[GATE]` **Criterios originales en campo separado** -- `criteriosOriginales[]` y `criteriosAceptacion[]` coexisten.
14. `[GATE]` **Tareas con DoD verificable** -- `[VERBO] [ARTEFACTO] en [UBICACIÓN] -- DoD: [criterio concreto]`
15. `[GATE]` **PERT triple coherente** -- O ≤ P ≤ Pe → E = (O + 4P + Pe) / 6
16. `[ESTILO]` **Perfiles mínimos: DEV y QA** -- Solo separar FE/DB si hay rol dedicado en el equipo.
17. `[ARQUITECTURA]` **Template HTML inmutable** -- `sprint-dashboard.html` contiene TODO el CSS y JS. Nunca generar CSS/JS desde agentes.
18. `[ARQUITECTURA]` **Output limpio** -- Solo `index.html` + `data.json` en output/Sprint-X/ (+ `data.previous.json` en modo iteración). Sin parciales, sin individuales.
19. `[ARQUITECTURA]` **Templates son contratos** -- Leer templates/ antes de generar output.

### Reglas de Estándares de Calidad

20. `[GATE]` **ISO 29148 como contrato** -- 9 atributos: Necesario, Apropiado, Inequívoco, Completo, Singular, Factible, Verificable, Correcto, Conforme.
21. `[GATE]` **Calificación ISO 0-5 obligatoria** -- Fórmula: `(iso29148_norm * 0.50 + invest_norm * 0.30 + iso25010_norm * 0.20) * 5`
22. `[GATE]` **CAs ISO-compliant** -- Verificable, Singular, Inequívoco. Si no cumple → BLOQUEO.
23. `[ESTILO]` **Cobertura ISO 25010 en NFRs** -- Al menos 1 tarea de verificación por cada característica aplicable.
24. `[ARQUITECTURA]` **Agentes producen DATA** -- JSON puro. Nunca HTML, CSS ni JS.
25. `[ARQUITECTURA]` **1 template renderiza todo** -- sprint-dashboard.html lee window.__SPRINT_DATA__ y renderiza.
26. `[ARQUITECTURA]` **Contexto UNA VEZ** -- El orquestador lee archivos; los agentes reciben texto plano en el prompt.

### Reglas de Entregables (NO NEGOCIABLES)

27. `[BLOQUEANTE]` **UN SOLO HTML por sprint** -- `output/Sprint-X/index.html` es el único entregable visual.
28. `[ARQUITECTURA]` **Tabs del dashboard (fijas)**:
    1. **Dashboard Sprint** -- KPIs, gauges ISO, tabla HUs, HITL (Focus Mode via "Revisar HU").
    2. **Avance del Sprint** -- 4 sub-tabs: 💰 EVM (con PV/EV/AC iniciados en 0) · 📅 Cronograma · ⚠ Radar de Riesgos · 📄 Specs.
       - Sub-tab Specs (siempre visible) tiene 3 estados: (a) esperando aprobación de HUs, (b) invitación a `/generar-specs`, (c) tabla con descarga `.md` por HU. Ver agente `spec-writer.md` para el marco ASDD.
    3. **Informe Cliente** -- Renderizado desde `data.json.informe_cliente`.
    4. **Informes** (dropdown) -- Exportar/importar Markdown, imprimir PDF.
29. `[ARQUITECTURA]` **`generar-informe` NO genera archivos externos** -- Enriquece `data.json` con `informe_cliente` y re-inyecta en el template.
30. `[ESTILO]` **Tooltips obligatorios** -- `.ux-tip` con `data-tip`.
31. `[ESTILO]` **Guías visibles por vista** -- Callout de "Qué hacer aquí" colapsable.
32. `[ESTILO]` **Alerta de pérdida de estado** -- `beforeunload` con aviso si hay cambios sin exportar.
33. `[ESTILO]` **Banner sticky de respaldo** -- CTA "Descargar respaldo (Markdown)" cuando hay cambios locales.
34. `[ARQUITECTURA]` **Round-trip completo** -- Markdown exportado contiene `<!-- RR-STATE-BEGIN -->...JSON...<!-- RR-STATE-END -->`.
35. `[ARQUITECTURA]` **Chart offline-first** -- Chart.js por CDN con fallback SVG inline. Gantt siempre SVG.
36. `[BLOQUEANTE]` **EVM parte en cero** -- PV, EV, AC siempre inician en 0. Prohibido autocompletar.

### Reglas de Observabilidad (v2.0)

37. `[ESTILO]` **Checkpoints por fase** -- Cada fase del orquestador emite `[RR·CKPT] Fase N <estado> · <detalle>` en texto plano.
38. `[ESTILO]` **Heartbeat en fases largas** -- Si una fase tarda > 60s, emitir `[RR·CKPT] Fase N · heartbeat · esperando <cosa concreta>`.
39. `[BLOQUEANTE]` **Regla de no-silencio** -- Ver sección "🛡 Regla de no-silencio" al inicio de este archivo. Enforced por hook Stop (`.claude/scripts/watchdog-empty-turn.js`).
40. `[BLOQUEANTE]` **Snapshot guard --iteración** -- Antes de reescribir `data.json`, copiar actual a `data.previous.json`. Post-merge, verificar que HUs `pm_aprobada: true` no cambiaron.

---

## Formato esperado de las HUs de entrada

Rol + intención + propósito + detalle + criterios de aceptación base. Guía completa con ejemplos: [`docs/HUs/README.md`](docs/HUs/README.md).

---

## Sistema de Diseño

Tokens y guías visuales del dashboard: [`docs/referencia/ui-design-guidelines.md`](docs/referencia/ui-design-guidelines.md). El template HTML [`templates/core/sprint-dashboard.html`](templates/core/sprint-dashboard.html) es el único lugar donde se materializan (CSS + JS). **Los agentes nunca generan CSS ni JS.**

---

## Regression testing del analyzer

Cuando se modifica `templates/core/hu-calidad.schema.json`, `.claude/agents/hu-full-analyzer.md` o `scripts/consolidate-sprint.js`, correr las fixtures de regresión antes de mergear:

```bash
/refinar-sprint Sprint-dryrun --dry-run
node scripts/regression-check.js \
  docs/HUs/_fixtures/Sprint-dryrun/HU-dryrun.expectations.json \
  output/Sprint-dryrun/tmp/HU-dryrun.json
```

Exit 0 = todas las assertions `critical` pasan. Catálogo completo de las 13 reglas, contrato de expectations y política de ajuste: [`docs/HUs/_fixtures/README.md`](docs/HUs/_fixtures/README.md). Política de versionado del schema: [`docs/referencia/schema-migration-policy.md`](docs/referencia/schema-migration-policy.md).

---

## Checklist post-refactor (verificación rápida)

Si algo no funciona tras mover archivos, corre **`node scripts/preflight-check.js`**. Ejecuta 4 chequeos automáticos:

1. No hay merge markers sin resolver en `CLAUDE.md`, `templates/core/`, `.claude/agents/`, `.claude/skills/`.
2. Las 5 skills del proyecto están registradas en `.claude/skills/<name>/SKILL.md`.
3. Los 5 agentes del proyecto están registrados en `.claude/agents/<name>.md`.
4. El JS del template `sprint-dashboard.html` compila (no hay conflict markers embebidos en `<script>`, `<<`, etc.).

Exit codes: `0` = OK · `1` = fallos · `2` = error de ejecución.

Se recomienda correr también:
- Antes de cada commit (se puede enganchar a un pre-commit hook local con `git config core.hooksPath .claude/hooks`).
- Como primer paso de Fase -1 de `/refinar-sprint` (el orchestrator lo invoca).

Checks manuales adicionales si el preflight pasa pero algo sigue raro:
- Reiniciar sesión Claude Code; el system-reminder debe listar `refinar-sprint`, `refinar-hu`, etc.
- `Skill(skill="refinar-sprint")` no debe retornar "Unknown skill".
- `grep -r "_project/" .claude/skills/ .claude/agents/ CLAUDE.md` — no debe haber matches en archivos activos (solo en `_legacy/` si acaso).
