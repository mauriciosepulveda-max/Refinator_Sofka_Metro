# Requirement Refinator

Herramienta de refinamiento de historias de usuario para Product Managers.
Un sistema de agentes analiza las HUs del sprint, genera CAs en Gherkin, tareas tecnicas estimadas, riesgos y dependencias, y produce un unico dashboard HTML interactivo con HITL -- cumpliendo los estandares **ISO/IEC/IEEE 29148:2018** e **ISO/IEC 25010**.

> **Inspirado en:** JM Agentic Development Kit + ASD-main (ASDD orchestrator pattern)
> **Metodologia:** SDD -- Spec-Driven Development con quality gates
> **Normativa aplicada:** ISO/IEC/IEEE 29148:2018 (Requisitos) . ISO/IEC 25010 (Calidad del producto)

---

## Principios Arquitectónicos

1. **Contexto se lee UNA VEZ** -- El orquestador lee todos los archivos y pasa el contenido como texto a los agentes. Los agentes nunca leen archivos.
2. **1 agente por HU** -- `hu-full-analyzer` ejecuta los 5 analisis (INVEST, ISO 29148, ISO 25010, Gherkin, Tareas, Riesgos, Dependencias) en una sola invocacion. No 5 agentes separados.
3. **Agentes producen DATA, no presentacion** -- Los agentes devuelven JSON puro conforme a `hu-calidad.schema.json`. Nunca HTML ni CSS.
4. **1 template HTML fijo** -- `templates/core/sprint-dashboard.html` es un archivo HTML estatico con CSS y JS incluidos. Renderiza todo desde `window.__SPRINT_DATA__`.
5. **Sin artefactos intermedios** -- No hay `parciales/*.json`, no hay `<hu-id>.html` individuales, no hay `style.css` ni `script.js` separados. Solo `data.json` + `index.html`.
6. **Eficiencia de invocaciones** -- 1 invocacion por HU + 0-1 reintentos por quality gates.

---

## Como usar (Flujo del PM)

### Paso 1 -- Preparar los insumos
1. Clonar este proyecto desde Git al IDE (VS Code, Cursor, Antigravity, etc.)
2. Agregar las HUs del sprint en `docs/HUs/Sprint-X/` (archivos `.md`)
3. Agregar/actualizar el contexto del proyecto en `docs/contexto/`:
   - `contexto-funcional.md` -- Informacion de negocio, reglas, dominio
   - `contexto-tecnico.md` -- Stack, arquitectura, integraciones, entornos

### Paso 2 -- Ejecutar el analisis
```
/refinar-sprint Sprint-X
```
Claude analiza TODAS las HUs en paralelo (1 agente por HU) y genera un unico `output/Sprint-X/index.html` con todo.

Para una HU individual:
```
/refinar-hu Sprint-X "nombre-archivo-hu.md"
```

### Paso 3 -- Revisar y dar feedback (HITL)
- Abrir `output/Sprint-X/index.html` en el navegador (SPA multi-vista)
- **Tab "Dashboard Sprint"**: KPIs, gauges ISO 29148 / INVEST / ISO 25010, tabla de HUs
- **Boton "Revisar HU"** por fila -> entra al **Focus Mode** de la HU
- En Focus Mode hay paneles colapsables: Narrativa, CAs Gherkin, Tareas PERT editables, Riesgos, Dependencias, Preguntas HITL, Feedback
- **Editar PERT** (O/P/Pe) -> recalcula E automaticamente
- **Responder preguntas HITL** en los textareas
- **Escribir feedback** libre en el panel de feedback
- **Barra sticky**: Guardar borrador / Rechazar / Aprobar HU
- Estado persistente en `localStorage` bajo `rr_hitl_<sprint-id>`
- **Tab "Valor Ganado"**: se habilita cuando el 100% de HUs esta aprobado (linea base EVM)
- **Tab "Informes"**: dropdown con export Markdown / informe ejecutivo / specs
- El export Markdown genera un `.md` estructurado con el feedback, consumible por `--iteracion`

### Paso 4 -- Iterar con feedback
```
/refinar-sprint Sprint-X --iteracion
```
Re-analiza SOLO las HUs rechazadas o con feedback (lee el `.md` exportado desde el dashboard + el estado de `data.json`). Las aprobadas se preservan intactas.

### Paso 5 -- Generar informe al cliente
```
/generar-informe Sprint-X --formato ejecutivo
```

### Paso 6 -- Generar specs SDD
```
/generar-specs Sprint-X
```

---

## Comandos disponibles

| Comando | Descripcion |
|---------|-------------|
| `/refinar-sprint <sprint-id>` | Analiza todas las HUs en paralelo -> 1 HTML |
| `/refinar-sprint <sprint-id> --iteracion` | Re-analiza HUs rechazadas/con feedback |
| `/refinar-sprint <sprint-id> --consolidar` | Solo regenera index.html con data.json existente |
| `/refinar-hu <sprint-id> <hu-file>` | Analiza 1 HU, acumula en data.json |
| `/iterar-refinamiento <sprint-id>` | Atajo para modo iteracion |
| `/generar-informe <sprint-id>` | Informe ejecutivo para el cliente |
| `/generar-specs <sprint-id>` | Specs SDD con HITL iterativo |

---

## Flujo del orquestador

```
[FASE 0 -- LECTURA DE INSUMOS (orquestador lee UNA VEZ)]
  docs/HUs/Sprint-X/*.md
  docs/contexto/contexto-funcional.md
  docs/contexto/contexto-tecnico.md
  templates/core/hu-calidad.schema.json
  templates/core/sprint-dashboard.html
  Construir contexto_condensado

[FASE 1 -- ANALISIS EN PARALELO (1 agente por HU)]
  Para CADA HU simultaneamente:
  └── @hu-full-analyzer  ->  JSON con INVEST + ISO 29148 + ISO 25010
                              + Gherkin + Tareas PERT + Riesgos + Dependencias

  11 HUs = 11 agentes en paralelo = ~11 invocaciones

[FASE 2 -- QUALITY GATES (orquestador valida)]
  G1: criteriosAceptacion >= criteriosOriginales
  G2: todas las tareas tienen DoD
  G3: todas las tareas tienen PERT triple (O, P, Pe)
  G4: calificacion_iso es numero 0-5

[FASE 2.5 -- ENRIQUECIMIENTO SELECTIVO (segunda pasada, solo cuando aplica)]
  Para cada HU, evaluar señales de activación:
  └── seguridad  -> @hu-security-enricher  (si iso25010.seguridad aplicable+no cubierta, O keywords auth)
  └── integracion -> @hu-integration-enricher  (si ≥2 deps externas, O keywords API/webhook)
  └── datos      -> @hu-data-enricher  (si tarea DB con PERT > 6h, O keywords migración/esquema)
  └── split      -> @hu-split-advisor  (si story_points ≥ 13, calidad insuficiente, O split recomendado)

  Enrichers corren en paralelo entre sí (por HU).
  El orquestador hace merge: append a criteriosAceptacion[], tareas[], preguntas_clarificacion[].
  Bloques de enriquecimiento quedan en enriquecimiento.<tipo> del JSON.
  G5: IDs de tareas nuevas no colisionan con los existentes.

[FASE 3 -- CONSOLIDACION (orquestador construye)]
  Reunir JSONs (con enriquecimientos integrados) -> calcular metricas_sprint -> escribir data.json

[FASE 4 -- GENERACION HTML (inyeccion en template)]
  Leer templates/core/sprint-dashboard.html
  Reemplazar /*__SPRINT_DATA__*/ con JSON de data.json
  Escribir output/Sprint-X/index.html

[FASE 5 -- REPORTE AL PM]
  Resumen: HUs, calificacion promedio, horas, riesgos, preguntas
  + indicar cuántas HUs fueron enriquecidas y por qué tipo de señal
```

---

## Agentes

| Agente | Rol | Normativa |
|--------|-----|-----------|
| `orchestrator` | Coordinador -- lee contexto, lanza agentes en paralelo, evalúa señales de enriquecimiento, consolida, inyecta en template | -- |
| `hu-full-analyzer` | Análisis completo de 1 HU (primera pasada): INVEST + ISO 29148 + ISO 25010 + Gherkin + Tareas PERT + Riesgos + Dependencias | ISO 29148 + ISO 25010 + INVEST |
| `report-builder` | Inyecta data.json en template HTML. NO genera CSS ni JS. | -- |
| `client-report-generator` | Informe ejecutivo al cliente | ISO 25030 |
| `spec-writer` | Specs SDD con Mermaid + HITL | ISO 29148 |

**Enrichment Agents (segunda pasada selectiva)** -- invocados por el orchestrator solo cuando detecta señales específicas en el output de hu-full-analyzer:

| Agente | Señal de activación | Enriquecimiento |
|--------|--------------------|-----------------| 
| `hu-security-enricher` | iso25010.seguridad aplicable+no cubierta, O keywords auth/permisos | STRIDE, OWASP, CAs y tareas de seguridad |
| `hu-integration-enricher` | ≥2 deps externas, O keywords API/webhook | Contratos de API, resiliencia, CAs de fallos |
| `hu-data-enricher` | tarea DB con PERT > 6h, O keywords migración/esquema | Modelo de datos, consistencia, CAs de integridad |
| `hu-split-advisor` | story_points ≥ 13, calidad insuficiente, O split recomendado | 2-3 HUs derivadas listas para backlog |

Agentes legacy preservados en `_legacy/` como referencia -- su lógica fue absorbida por hu-full-analyzer:
`hu-analyzer`, `gherkin-writer`, `task-estimator`, `risk-analyst`, `dependency-mapper`

---

## Estructura de archivos

```
Requirement Refinator V3/
├── CLAUDE.md                              <- Este archivo (workflow master)
├── README.md
├── .gitignore
├── .claude/
│   ├── agents/
│   │   ├── _project/                      <- Agentes PROPIOS del Requirement Refinator
│   │   │   ├── orchestrator.md            <- Coordinacion (lee, lanza, consolida, enriquece)
│   │   │   ├── hu-full-analyzer.md        <- Análisis completo 1 HU -> JSON (primera pasada)
│   │   │   ├── hu-security-enricher.md    <- Enricher: STRIDE + OWASP + CAs de seguridad
│   │   │   ├── hu-integration-enricher.md <- Enricher: contratos API + resiliencia
│   │   │   ├── hu-data-enricher.md        <- Enricher: modelo de datos + consistencia
│   │   │   ├── hu-split-advisor.md        <- Enricher: propuesta de división de HUs grandes
│   │   │   ├── report-builder.md          <- Inyecta data en template HTML
│   │   │   ├── client-report-generator.md <- Informe al cliente
│   │   │   ├── spec-writer.md             <- Specs SDD
│   │   │   └── _legacy/                   <- Reemplazados, no usados en flujo principal
│   │   │       └── hu-analyzer.md, gherkin-writer.md, etc.
│   │   └── _kit-base/                     <- 101 agentes del JM Kit (READ-ONLY, fuente de inspiración)
│   ├── rules/
│   │   ├── _project/                      <- Reglas propias del Requirement Refinator
│   │   └── _kit-base/                     <- R-001 a R-008 + GEMINI.md (READ-ONLY)
│   ├── skills/
│   │   ├── _project/                      <- Skills propios del proyecto
│   │   │   ├── refinar-sprint/SKILL.md
│   │   │   ├── refinar-hu/SKILL.md
│   │   │   ├── iterar-refinamiento/SKILL.md
│   │   │   ├── generar-informe/SKILL.md
│   │   │   └── generar-specs/SKILL.md
│   │   └── _kit-base/                     <- 110 skills genericos (READ-ONLY)
│   └── workflows/
│       └── _kit-base/                     <- 101 workflows genericos (READ-ONLY)
├── docs/
│   ├── HUs/
│   │   └── Sprint-X/                      <- HUs del Sprint (el PM crea esta carpeta)
│   ├── contexto/
│   │   ├── contexto-funcional.template.md <- Plantilla de contexto de negocio
│   │   └── contexto-tecnico.template.md   <- Plantilla de stack y arquitectura
│   └── referencia/                        <- Documentacion de normas y guias
│       ├── TUTORIAL.md
│       ├── ui-design-guidelines.md
│       └── ISO_IEC_25010_Calidad.md, etc.
├── output/
│   └── Sprint-X/                          <- Generado automaticamente
│       ├── index.html                     <- Dashboard UNICO (todo incluido)
│       └── data.json                      <- Datos del sprint (JSON)
├── scripts/                               <- Utilitarios Node.js (no son el flujo principal)
│   ├── approve_specs.js
│   ├── generador_informes.js
│   ├── generador_specs.js
│   └── inyectar_feedback.js
└── templates/
    ├── core/                              <- CRITICOS — el orquestador los lee
    │   ├── sprint-dashboard.html          <- Template HTML fijo (CSS+JS incluidos)
    │   └── hu-calidad.schema.json         <- Contrato de output JSON
    └── auxiliary/                         <- Templates de referencia (poco usados)
        ├── refined_user_story_template.md
        ├── risk_dependency_template.md
        └── spec-sdd-template.md
```

---

## Reglas del sistema

### Reglas v1.0 -- Base

1. **Sin contexto, sin analisis** -- Si `docs/contexto/` esta vacio, pedir al PM que lo complete.
2. **Sin HUs, sin analisis** -- Verificar que existan archivos `.md` en `docs/HUs/Sprint-X/`.
3. **No inventar informacion tecnica** -- Si no esta en el contexto, marcarlo como "No documentado -- requiere confirmacion".
4. **Gherkin en espanol de negocio** -- Sin rutas de API ni IDs tecnicos.
5. **Estimaciones justificadas** -- Cada tarea incluye justificacion de tiempo.
6. **Preguntas, no suposiciones** -- Cuando falte info critica, generar preguntas de clarificacion.
7. **1 agente por HU, todos en paralelo** -- hu-full-analyzer hace todo. No 5 agentes separados. Los enrichers son segunda pasada selectiva, no reemplazo.
8. **Output por sprint** -- Cada sprint en `output/Sprint-X/`. No sobreescribir sprints anteriores.
9. **HUs aprobadas son inmutables** -- En modo iteracion, no tocar las aprobadas.
10. **Sin spec APROBADO -> sin implementacion** -- Regla cardinal del SDD.

### Reglas de Cobertura y Calidad

11. **Refinamiento ANADE, nunca RESTA** -- data.json contiene TODA la informacion del fuente + el analisis.
12. **Validacion de cobertura obligatoria** -- Comparar seccion por seccion el original vs refinado.
13. **Criterios originales en campo separado** -- `criteriosOriginales[]` y `criteriosAceptacion[]` coexisten.
14. **Tareas con DoD verificable** -- `[VERBO] [ARTEFACTO] en [UBICACION] -- DoD: [criterio concreto]`
15. **PERT triple obligatorio** -- O / P / Pe -> E = (O + 4P + Pe) / 6
16. **Perfiles minimos: DEV y QA** -- Solo separar FE/DB si hay rol dedicado en el equipo.
17. **Template HTML inmutable** -- `sprint-dashboard.html` contiene TODO el CSS y JS. Nunca generar CSS/JS desde agentes.
18. **Output limpio** -- Solo `index.html` + `data.json` en output/Sprint-X/. Sin parciales, sin individuales, sin style.css/script.js separados.
19. **Templates son contratos** -- Leer templates/ antes de generar output.

### Reglas de Estándares de Calidad

20. **ISO 29148 como contrato** -- 9 atributos: Necesario, Apropiado, Inequivoco, Completo, Singular, Factible, Verificable, Correcto, Conforme.
21. **Calificacion ISO 0-5 obligatoria** -- Formula: `(iso29148_norm * 0.50 + invest_norm * 0.30 + iso25010_norm * 0.20) * 5`
22. **CAs ISO-compliant** -- Verificable, Singular, Inequivoco. Si no cumple -> BLOQUEO.
23. **Cobertura ISO 25010 en NFRs** -- Al menos 1 tarea de verificacion por cada caracteristica aplicable.
24. **Agentes producen DATA** -- JSON puro. Nunca HTML, CSS ni JS.
25. **1 template renderiza todo** -- sprint-dashboard.html lee window.__SPRINT_DATA__ y renderiza.
26. **Contexto UNA VEZ** -- El orquestador lee archivos; los agentes reciben texto plano en el prompt.

### Reglas de Entregables (NO NEGOCIABLES)

27. **UN SOLO HTML por sprint** -- `output/Sprint-X/index.html` es el unico entregable visual. NO se generan archivos `informe.html`, `evm_dashboard.html`, `US-XX.html` o similares por separado. Todo vive dentro del dashboard como vistas/tabs.
28. **Tabs del dashboard (fijas)**:
    1. **Dashboard Sprint** -- KPIs, gauges ISO, tabla HUs, HITL (Focus Mode via "Revisar HU").
    2. **Avance del Sprint** -- (antes "Valor Ganado") EVM completo: KPIs BAC/PV/EV/AC, tabla editable por HU con CV/SV/CPI/SPI/EAC/ETC/VAC/TCPI, grafico de variacion (PV/EV/AC timeline con snapshots), Gantt SVG de ruta critica, panel de riesgos agregados del sprint, datos del sprint (fechas, capacidad), historial de mediciones.
    3. **Informe Cliente** -- Informe ejecutivo embebido: resumen ejecutivo, Gantt SVG, funcionalidades confirmadas en lenguaje de negocio, riesgos de negocio, clausula de aprobacion pasiva. Renderizado desde `data.json.informe_cliente`.
    4. **Informes** (dropdown) -- Exportar/importar Markdown, imprimir PDF.
29. **`generar-informe` NO genera archivos externos** -- Enriquece `data.json` con la clave `informe_cliente` (params + resumen ejecutivo + gantt secuenciado + riesgos agregados en lenguaje de negocio) y re-inyecta en el template. El PM abre el mismo `index.html` y cambia a la tab "Informe Cliente".
30. **Tooltips obligatorios** -- Todo elemento no trivial debe tener `.ux-tip` con `data-tip` explicando su proposito. Los inputs editables deben decir que hacer y cuando.
31. **Guias visibles por vista** -- Cada vista inicia con un callout de "Que hacer aqui" (3-5 bullets) que el PM puede colapsar.
32. **Alerta de perdida de estado** -- El template DEBE implementar `beforeunload` que avisa al usuario si hay cambios HITL o mediciones EVM sin exportar. Texto claro: "Tienes cambios sin descargar. Si cierras o recargas la pestana, perderas el feedback HITL y/o las mediciones EVM. Descarga el Markdown primero."
33. **Banner sticky de respaldo** -- Banner naranja persistente arriba del dashboard con CTA "Descargar respaldo (Markdown)" cuando existen cambios locales sin exportar.
34. **Round-trip completo** -- El Markdown exportado contiene bloque `<!-- RR-STATE-BEGIN -->...JSON...<!-- RR-STATE-END -->` con HITL + EVM historial. Import re-hidrata localStorage sin perdida.
35. **Chart offline-first** -- El grafico de variacion EVM intenta cargar Chart.js por CDN; si falla, renderiza un SVG fallback inline. El Gantt se renderiza siempre como SVG inline (sin Mermaid CDN).
36. **EVM parte en cero** -- Por defecto PV, EV y AC SIEMPRE inician en **0** (nunca en BAC ni en ningun otro valor). El PM los completa progresivamente a medida que avanza el sprint. Aplica tanto a la tabla por HU como a los totales del dashboard. Prohibido autocompletar PV=BAC al cierre o asumir valores iniciales distintos de 0.

---

## Formato esperado de las HUs de entrada

Las HUs deben estar en Markdown con al menos:
- Quien solicita (perfil/rol)
- Que quiere (intencion/funcionalidad)
- Para que (proposito/beneficio de negocio)
- Detalle del desarrollo solicitado
- Criterios de aceptacion (pueden ser basicos, los agentes los expandiran)

Ver `docs/HUs/README.md` para la guia completa.

---

## Sistema de Diseño

El template HTML usa el sistema de diseño definido en `docs/ui-design-guidelines.md`:
- **Primario:** `#FF7E08` (naranja)
- **Fondo oscuro:** `#000000` (negro -- header)
- **Fondo base:** `#FAF8F6` (gris cálido)
- **Fuentes:** Clash Grotesk (headings) + Inter (body) + JetBrains Mono (código)
- **Semánticos (RAG):** Verde `#16A34A` / Ámbar `#D97706` / Rojo `#DC2626`

Todo esto está definido UNA SOLA VEZ en `templates/core/sprint-dashboard.html`. Los agentes nunca generan CSS.
