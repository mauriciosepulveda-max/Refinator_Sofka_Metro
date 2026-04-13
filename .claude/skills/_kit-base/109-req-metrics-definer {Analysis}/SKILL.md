---
name: req-metrics-definer
description: Acompaña cada requerimiento con KPIs de éxito medibles (ej. "Tiempo de carga < 1s", "Reducción de clicks en un 20%").
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, data, kpi, metrics, impact]
---
# req-metrics-definer {Analysis} (v1.0)

> **"Si una funcionalidad no mueve una métrica, es ruido en la base de código."**

## Purpose
Definir cómo se medirá el éxito o el impacto de una historia de usuario una vez implementada en producción. Genera variables de rastreo (tracking) y eventos de analítica a implementar.

**When to use:** Durante el refinamiento de la Historia de Usuario, antes de que el equipo de desarrollo la estime.

## 1. The Physics
1. **Law of Measurement:** Todo feature nuevo debe tener al menos una métrica primaria de éxito.
2. **Law of Instrumentality:** Las métricas deben conectarse a propiedades/eventos nativos de Google Analytics 4 (GA4) o Firebase Performance Monitoring.
3. **Law of Baselines:** Debes definir contra qué se compara (Status Quo vs Target).

## 2. The Protocol
### Phase 1: Objective Decoding
1. Ingesta el "So That..." (para qué) de la historia de usuario.
2. Entra al catálogo de métricas de negocio (Conversión, Retención, Satisfacción, Desempeño).

### Phase 2: Variable Definition
1. Establece la **Primary Metric** (La que determina si fue un éxito o fracaso).
2. Establece la **Secondary Metric / Guardrail Metric** (Para asegurar que este feature no dañe otra cosa; ej. aumenta conversión pero sube la latencia).

### Phase 3: Telemetry Mapping
1. Asigna Eventos de Firebase Analytics `logEvent` recomendados para medirlo.
2. Asigna Trazo de Firebase Performance (Custom Traces) si es una métrica de velocidad.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| User Story | Text | Yes | La historia a instrumentar |
| Business Goal | Text | No | Objetivo global (si está disponible) |
| Output | Type | Description |
|--------|------|-------------|
| Telemetry Spec | Markdown | Métricas, baseline, y eventos GA4 de captura |

## 4. Quality Gates
- [ ] La métrica primaria es cuantitativa, no cualitativa (No "Que el usuario sea feliz", sino "NPS > 40").
- [ ] Todos los eventos GA4 sugeridos siguen la convención de nomenclatura `snake_case`.

## 5. Self-Correction Triggers
> [!WARNING]
> IF la métrica definida no puede medirse técnicamente con el stack web/app estándar, THEN pedir métrica alternativa o simplificada (Proxy Metric).
