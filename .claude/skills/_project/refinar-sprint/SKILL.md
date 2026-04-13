---
name: refinar-sprint
description: Orquesta el análisis completo de todas las HUs de un sprint. Lee contexto UNA VEZ, lanza 1 hu-full-analyzer por HU en paralelo, consolida en data.json, inyecta en template HTML. Output = 1 solo index.html con todo. Soporta --iteracion y --consolidar.
argument-hint: "<sprint-id>  (ej: Sprint-1)  [--iteracion]  [--consolidar]"
---

# Skill: refinar-sprint

Orquestador del Requirement Refinator V1. Analiza TODAS las HUs de un sprint y produce **un solo archivo HTML** con todo el contenido: dashboard, detalle por HU, Gherkin, tareas, riesgos, dependencias, preguntas y HITL.

## Activacion

```
/refinar-sprint Sprint-1             # Analiza todas las HUs, genera 1 HTML
/refinar-sprint Sprint-1 --iteracion # Re-analiza HUs rechazadas/con feedback
/refinar-sprint Sprint-1 --consolidar # Solo regenera index.html con data.json existente
```

## Arquitectura (Principios)

- **Contexto se lee UNA VEZ** por el orquestador, se pasa como texto a los agentes.
- **1 agente por HU** (`hu-full-analyzer`) hace los 5 analisis en una sola invocacion.
- **Agentes producen DATA** (JSON), nunca presentacion (HTML/CSS).
- **1 template HTML fijo** (`templates/sprint-dashboard.html`) renderiza todo via JS.
- **Sin artefactos intermedios** — no hay `parciales/`, no hay HTMLs individuales.
- **Output final**: `output/<sprint-id>/index.html` + `output/<sprint-id>/data.json`

## Proceso

### Fase 0 — Configuración del Sprint (INTERACTIVA, BLOQUEANTE)

**Antes de leer ningún archivo**, preguntar al PM los parámetros del sprint en UN SOLO mensaje:

```
Para configurar el Gantt y el cálculo de equipo necesito algunos datos:

1. Fecha de inicio del sprint (ej: 2026-04-07)
2. Fecha de fin del sprint   (ej: 2026-04-25)
3. Días hábiles netos del sprint (o calcular desde fechas excluyendo fines de semana)
4. Composición del equipo — lista cada persona con su rol principal:
   Ej: "Ana García - DEV, Luis Torres - DEV, María Pinto - QA, ..."
   (Roles posibles: DEV, FE, QA, DB, DEVOPS, UX)
5. Ausencias programadas (vacaciones, permisos) durante el sprint:
   Ej: "Ana García ausente 3 días (semana 2), Luis Torres ausente 1 día"
   (o "Sin ausencias")
6. Horas efectivas de trabajo por persona por día (default: 6h — descuenta reuniones)
```

Con la respuesta, construir `sprint_config`:
```json
{
  "fecha_inicio": "YYYY-MM-DD",
  "fecha_fin": "YYYY-MM-DD",
  "dias_habiles": N,
  "horas_dia_persona": 6,
  "equipo": [
    {"nombre": "Ana García", "rol": "DEV", "dias_ausencia": 0},
    {"nombre": "Luis Torres", "rol": "DEV", "dias_ausencia": 3},
    {"nombre": "María Pinto", "rol": "QA",  "dias_ausencia": 0}
  ],
  "capacidad_por_rol": {
    "DEV": { "personas": 2, "dias_disponibles": [N_ana, N_luis], "horas_totales": X },
    "QA":  { "personas": 1, "dias_disponibles": [N_maria], "horas_totales": Y }
  },
  "bac_horas": N  // suma de horas totales disponibles de todo el equipo
}
```

Donde:
- `dias_disponibles` para cada persona = `dias_habiles - dias_ausencia`
- `horas_totales` por rol = suma de `dias_disponibles × horas_dia_persona` de todos los miembros del rol
- `bac_horas` = suma de todas las `horas_totales` (capacidad total del sprint)

Luego leer archivos en paralelo:

```
Leer en paralelo:
├── docs/HUs/<sprint-id>/*.md              ← Todas las HUs
├── docs/contexto/contexto-funcional.md    ← Contexto de negocio
├── docs/contexto/contexto-tecnico.md      ← Stack, arquitectura
├── templates/hu-calidad.schema.json       ← Contrato de output JSON
└── templates/sprint-dashboard.html        ← Template HTML fijo
```

Validaciones bloqueantes:
- Si no existen archivos `.md` en `docs/HUs/<sprint-id>/` → ERROR, listar sprints disponibles.
- Si `docs/contexto/` esta vacio → ADVERTENCIA, preguntar si continuar.

Construir `contexto_condensado`:
```
Proyecto: [nombre]
Dominio: [descripcion]
Stack: [tecnologias]
Microservicios: [lista]
Integraciones: [lista]
Sprint: <sprint-id>
HUs del sprint:
  - [filename1]: [titulo extraido del contenido]
  - [filename2]: [titulo]
  ...
```

### Fase 1 — Analisis en Paralelo (1 agente por HU)

Lanzar **todos** los `hu-full-analyzer` en paralelo:

```
Para cada HU en docs/HUs/<sprint-id>/:
└── Agent "hu-full-analyzer" con prompt:
    [SPRINT]: Sprint-1
    [HU_FILENAME]: nombre-archivo.md
    [CONTEXTO_CONDENSADO]: <texto>
    [LISTA_HUs_SPRINT]: <lista>
    [CONTENIDO_COMPLETO_HU]: <texto integro del .md>
```

> **⚠ REGLA CRÍTICA DE TOKENS**: El prompt que envías a cada hu-full-analyzer NO debe incluir:
> - El contenido de `hu-calidad.schema.json` (el agente ya conoce su contrato de output)
> - El contenido del template HTML
> - Los contenidos de otras HUs del sprint (solo la lista de IDs/títulos)
>
> El schema solo se usa en el orquestador para quality gates. NO se pasa a los agentes.

11 HUs = 11 agentes en paralelo = ~11 invocaciones totales.

### Fase 2 — Quality Gates

Al recibir cada JSON, validar:

| Gate | Condicion | Accion si falla |
|------|-----------|-----------------|
| G1 | `criteriosAceptacion.length >= criteriosOriginales.length` | Relanzar agente (max 1 reintento) |
| G2 | Todas las tareas tienen `dod` no vacio | Relanzar agente |
| G3 | Todas las tareas tienen O, P, Pe | Relanzar agente |
| G4 | `calificacion_iso` es numero 0-5 | Recalcular directamente |

Si falla 2 veces → `quality_gate_failed: true`, continuar.

### Fase 3 — Consolidacion

1. Reunir JSONs de todos los hu-full-analyzer.
2. Calcular metricas del sprint:
   - `calificacion_iso_promedio` = promedio de calificacion_iso
   - `iso29148_avg` = promedio de iso29148_score_norm * 100
   - `invest_avg` = promedio de invest_score_norm * 100
   - `iso25010_avg` = promedio de iso25010_score_norm * 100
   - `total_horas` = suma de estimacion_total_horas
   - `total_riesgos_criticos` = count de riesgos con severidad "Alta"
   - `total_preguntas` = suma de preguntas_clarificacion.length
   - `distribucion_calificaciones` = count por nivel
3. Incluir `sprint_config` (capturado en Fase 0) directamente en `data.json`:
   ```json
   {
     "sprint_id": "...",
     "sprint_config": { ...sprint_config de Fase 0... },
     "metricas_sprint": { ... },
     "historias": [ ... ]
   }
   ```
4. Escribir `output/<sprint-id>/data.json`.

### Fase 4 — Generacion del HTML

1. Leer `templates/sprint-dashboard.html`.
2. Reemplazar `/*__SPRINT_DATA__*/null` con el JSON de data.json.
3. Escribir `output/<sprint-id>/index.html`.

**NO generar CSS. NO generar JS. NO generar HTMLs individuales.**

### Fase 5 — Reporte al PM

```
══════════════════════════════════════════════════════════════
  ANALISIS DE <sprint-id> COMPLETADO
══════════════════════════════════════════════════════════════

  [N] historias analizadas
  Calificacion ISO promedio: [N.N] / 5.0
  [N] horas estimadas | [N] riesgos criticos | [N] preguntas

  Dashboard: output/<sprint-id>/index.html

  Proximos pasos:
  /refinar-sprint <sprint-id> --iteracion
  /generar-informe <sprint-id>
══════════════════════════════════════════════════════════════
```

## Modo --iteracion

1. Leer `output/<sprint-id>/data.json` existente.
2. Mover metricas actuales a `iteracion_anterior` en data.json.
3. Identificar HUs con `pm_aprobada: false` o `pm_feedback` no vacio.
4. Leer contexto del proyecto (1 vez).
5. Lanzar hu-full-analyzer SOLO para HUs que necesitan re-analisis, incluyendo `pm_feedback` en el prompt.
6. Preservar intactas las HUs con `pm_aprobada: true`.
7. Regenerar data.json e index.html.

## Modo --consolidar

1. Leer `output/<sprint-id>/data.json` existente (sin re-analizar).
2. Leer template HTML.
3. Regenerar solo `index.html`.

## Reglas

- **Sin HUs → sin analisis** — Verificar siempre primero.
- **1 agente por HU** — hu-full-analyzer hace todo. No 5 agentes separados.
- **Contexto UNA VEZ** — El orquestador lee; los agentes reciben texto plano.
- **Template inmutable** — No modificar sprint-dashboard.html, solo inyectar datos.
- **Sin intermedios** — No crear parciales/, no crear <hu-id>.html.
- **HUs aprobadas inmutables** — En modo iteracion, pm_aprobada: true no se toca.
- **Output por sprint** — Cada sprint en output/Sprint-X/. No sobreescribir otros sprints.
