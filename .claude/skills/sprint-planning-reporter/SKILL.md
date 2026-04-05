---
name: sprint-planning-reporter
description: Toma el contexto de las Historias de Usuario refinadas y aprobadas en el Sprint y genera un Informe de Planificación (Sprint Planning Report) con ruta crítica, riesgos cruzados e interdependencias.
---

# `sprint-planning-reporter`

## Propósito
Analizar en conjunto todas las HUs refinadas durante el proceso de *Requirement Refinator* y consolidar un informe de alto nivel para el Sprint Planning.

## Flujo de Trabajo
1.  **Ingesta de Datos:** Consumir todos los archivos JSON de las HUs aprobadas (`parciales/*.json`).
2.  **Mapeo de Dependencias (Interdependencias):** Rastrear referencias de bloqueos cruzados entre HUs (e.g. `BlockedBy`).
3.  **Cálculo de Ruta Crítica (Critical Path) y Gantt de Proyecto:** Ordenar las HUs lógicamente basadas en dependencias y sumar los puntos de historia / estimación (1 día = 8H). Mapear la ruta crítica programáticamente construyendo un string de [Mermaid Gantt](https://mermaid-js.github.io/mermaid/#/gantt) incrustado.
4.  **Matriz de Riesgos Transversales (Risk Management):** Agrupar y elevar los riesgos individuales a nivel de alcance del Sprint, planeando estrategias de mitigación consolidadas. En el Gantt, resaltar de color rojo o con tag `crit` las HUs cuyo riesgo asociado sea `ALTO`.
5.  **Generación de HTML y MD:** Compilar todos estos insights inyectando el chart interactivo de Mermaid directamente en el Master Dashboard HTML de salida `informe.html` y su equivalente `informe.md`.

## Reglas
-   Debe ejecutarse SIEMPRE como la **Fase de Cierre** de un refinamiento de sprint.
-   El output debe mantener el sistema de diseño Sofka BU1 (colores RAG, layout limpio).
-   Destacar obligatoriamente las métricas de alcance total (Horas estimadas, Story Points).
