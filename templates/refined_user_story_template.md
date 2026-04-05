# Plantilla: Historia de Usuario Refinada v2.0

> **Normativa:** ISO/IEC/IEEE 29148:2018 (Cláusula 5.2.5 — 9 características del requisito) + ISO/IEC 25010 (Modelo de calidad del producto)  
> **Uso:** Esta plantilla es el artefacto de salida estándar del `@hu-analyzer`. Todo campo entre `[corchetes]` debe ser completado. Todo campo marcado con `⚠️` requiere validación humana.

---

## Encabezado

| Campo | Valor |
|---|---|
| **ID** | `US-XX` |
| **Épica** | `EPIC-XX — [Nombre de la épica]` |
| **Título** | [Nombre corto funcional, máx. 60 caracteres] |
| **Arquetipo / Actor** | [Rol definido con código de permiso si aplica] |
| **Prioridad (MoSCoW)** | Must / Should / Could / Won't |
| **Nivel de Valor** | Critical / High / Medium / Low |
| **Story Points** | [Número] ⚠️ Estimación inicial — requiere validación humana |
| **Sprint Objetivo** | Sprint [N] |
| **Estado** | Borrador / En Revisión / Aprobada / Rechazada |
| **Fecha de Refinamiento** | [DD/MM/YYYY] |

---

## Calificación de Calidad ISO

> Esta calificación se calcula automáticamente y aparece destacada en el dashboard HTML.

| Dimensión | Puntaje | Peso | Contribución |
|-----------|---------|------|-------------|
| **ISO/IEC/IEEE 29148** (9 criterios) | [N.N] / 9 | 50% | [N.N] |
| **INVEST** (6 criterios) | [N.N] / 6 | 30% | [N.N] |
| **ISO/IEC 25010** (cobertura NFRs) | [N] / [N] aplicables | 20% | [N.N] |
| **CALIFICACIÓN TOTAL** | | | **[N.N] / 5.0** |

**Nivel:** [Excelente / Buena / Aceptable / Deficiente / Crítica]  
**Acción recomendada:** [Lista para desarrollo / Ajustes menores / Revisión requerida / Reescritura / BLOQUEADA]

---

## Definición Canónica (Sintaxis ISO/IEC/IEEE 29148)

> **Como** [Arquetipo / Permiso de Sistema con código si aplica],  
> **quiero** [Acción específica en el sistema con verbo en infinitivo — singular, sin "y"],  
> **para** [Motivo de negocio / métrica que cambiará / beneficio verificable para el usuario final].

**Narrativa completa:**
```
Como [rol],
quiero [acción],
para [beneficio de negocio medible].
```

---

## Validación INVEST

| Criterio | Estado | Evidencia del texto fuente |
|----------|--------|--------------------------|
| **I** — Independiente: No está acoplada a otro US del sprint | CUMPLE / PARCIAL / NO_CUMPLE | [cita del texto] |
| **N** — Negociable: Define QUÉ, no CÓMO | CUMPLE / PARCIAL / NO_CUMPLE | [cita del texto] |
| **V** — Valiosa: Métrica de negocio identificada | CUMPLE / PARCIAL / NO_CUMPLE | Métrica: _______ |
| **E** — Estimable: Criterios de frontera definidos | CUMPLE / PARCIAL / NO_CUMPLE | [cita del texto] |
| **S** — Pequeña: Entregable en 1 sprint (≤ 13 SP) | CUMPLE / PARCIAL / NO_CUMPLE | SP estimados: ___ |
| **T** — Testeable: QA puede automatizar pruebas | CUMPLE / PARCIAL / NO_CUMPLE | [cita del texto] |

**Puntaje INVEST:** [N.N] / 6.0

---

## Evaluación ISO/IEC/IEEE 29148:2018 — 9 Características (Cláusula 5.2.5)

| # | Característica | Estado | Nota / Evidencia |
|---|---------------|--------|-----------------|
| 1 | **Necesario** — Capacidad esencial sin la cual hay deficiencia grave | CUMPLE / PARCIAL / NO_CUMPLE | [nota] |
| 2 | **Apropiado** — Nivel de detalle correcto para una HU (sin diseño técnico prematuro) | CUMPLE / PARCIAL / NO_CUMPLE | [nota] |
| 3 | **Inequívoco** — Una sola interpretación posible; sin términos vagos | CUMPLE / PARCIAL / NO_CUMPLE | [nota o términos vagos detectados] |
| 4 | **Completo** — Describe exhaustivamente la capacidad; sin TBDs críticos | CUMPLE / PARCIAL / NO_CUMPLE | [nota] |
| 5 | **Singular** — Una sola capacidad; sin conjunciones "y/o" que unan funcionalidades | CUMPLE / PARCIAL / NO_CUMPLE | [nota] |
| 6 | **Factible** — Realizable dentro de restricciones técnicas y temporales conocidas | CUMPLE / PARCIAL / NO_CUMPLE | [nota] |
| 7 | **Verificable** — Puede probarse objetivamente; tiene umbrales o condiciones medibles | CUMPLE / PARCIAL / NO_CUMPLE | [nota o umbral faltante] |
| 8 | **Correcto** — Representa fielmente la necesidad original sin distorsiones | CUMPLE / PARCIAL / NO_CUMPLE | [nota] |
| 9 | **Conforme** — Sigue el formato Como/Quiero/Para y las convenciones del proyecto | CUMPLE / PARCIAL / NO_CUMPLE | [nota] |

**Puntaje ISO 29148:** [N.N] / 9.0

---

## Cobertura ISO/IEC 25010 — Características de Calidad Aplicables

| Característica | Aplicable | Cubierta en CAs | Observación |
|----------------|-----------|-----------------|-------------|
| **Adecuación Funcional** (Completitud, Corrección, Pertinencia) | Sí / No | Sí / No | [obs] |
| **Eficiencia de Desempeño** (Tiempo, Recursos, Capacidad) | Sí / No | Sí / No | [obs o umbral faltante] |
| **Compatibilidad** (Coexistencia, Interoperabilidad) | Sí / No | Sí / No | [obs] |
| **Usabilidad** (Reconocimiento, Aprendizaje, Operabilidad, Accesibilidad) | Sí / No | Sí / No | [obs] |
| **Fiabilidad** (Madurez, Disponibilidad, Tolerancia a fallos, Recuperabilidad) | Sí / No | Sí / No | [obs] |
| **Seguridad** (Confidencialidad, Integridad, No repudio, Responsabilidad) | Sí / No | Sí / No | [obs] |
| **Mantenibilidad** (Modularidad, Analizabilidad, Modificabilidad, Testabilidad) | Sí / No | Sí / No | [obs] |
| **Portabilidad** (Adaptabilidad, Instalabilidad) | Sí / No | Sí / No | [obs] |

**Cobertura:** [N] / [N] características aplicables cubiertas

---

## Criterios de Aceptación Originales (Fuente Primaria)

> ⚠️ **Estos criterios son la fuente de verdad del cliente/negocio. NUNCA se eliminan. Los escenarios Gherkin deben cubrir cada uno de estos criterios.**

1. [CA original 1 — copiado textualmente del documento fuente]
2. [CA original 2 — copiado textualmente]
3. [CA original N — copiado textualmente]

---

## Criterios de Aceptación — Notación Gherkin (BDD) — ISO 29148 compliant

> **Norma:** Cada escenario cumple con ISO/IEC/IEEE 29148: Verificable, Singular, Inequívoco, Completo, Apropiado.  
> **Mínimo:** 5 escenarios: 1 happy path (Scenario Outline) + 1 alternativo + 1 error + 1 edge case + 1 regresión.

### Escenario [N]: [Nombre — Happy Path / Alternativo / Error / Edge Case / Regresión]

| Propiedad | Valor |
|-----------|-------|
| ID | CA-XX-0N |
| CA Original cubierto | [CA original #N del documento fuente] |
| ISO 29148 | ✓ Verificable · ✓ Singular · ✓ Inequívoco · ✓ Completo · ✓ Apropiado |

```gherkin
#language: es
Característica: [funcionalidad en lenguaje de negocio]

  @[tipo-escenario]
  Escenario: [descripción clara]
    Dado que [precondición completa y explícita]
    Cuando [acción única del usuario]
    Entonces [resultado observable y concreto — sin términos vagos]
    Y [resultado adicional si aplica]
```

---

## Tareas Técnicas — Con DoD + PERT Triple

> ⚠️ **Estimación inicial — requiere validación del equipo técnico.**  
> Formato DoD obligatorio: `[VERBO] [ARTEFACTO] en [UBICACIÓN] — DoD: [criterio concreto]`

| ID | Descripción + DoD | Tipo | O | P | Pe | PERT | Complejidad |
|---|---|---|---|---|---|---|---|
| T-XX-01 | [VERBO] [ARTEFACTO] en [UBICACIÓN] — DoD: [criterio verificable] | DEV/QA | [N]h | [N]h | [N]h | [N.N]h | Alta/Media/Baja |
| T-XX-02 | [...] — DoD: [...] | [Tipo] | [N]h | [N]h | [N]h | [N.N]h | [...] |

> **Fórmula PERT:** E = (O + 4·P + Pe) / 6

**Total estimado:** [N.N] horas ⚠️ _Estimación inicial — requiere validación humana_

**Distribución por perfil:**
- DEV: [N]h · QA: [N]h · FE: [N]h · DEVOPS: [N]h · UX: [N]h

### Tareas de Calidad ISO 25010 (NFRs)

> Tareas técnicas generadas para cubrir características de calidad ISO 25010 aplicables no cubiertas en los CAs funcionales.

| ID | Característica ISO 25010 | Descripción + DoD | Tipo | PERT |
|---|---|---|---|---|
| T-XX-NFR-01 | [Fiabilidad / Seguridad / Eficiencia / ...] | [VERBO] [...] — DoD: [...] | QA/DEV | [N.N]h |

---

## Dependencias

| ID Dep. | Tipo | Referencia | Descripción |
|---|---|---|---|
| DEP-XX-01 | Historia | US-YY | [Qué funcionalidad previa es requerida] |
| DEP-XX-02 | Servicio externo | [Nombre] | [Qué capacidad se necesita] |
| DEP-XX-03 | Técnica | [Biblioteca/Framework] | [Qué debe instalarse/configurarse] |

> Si no hay dependencias: `Sin dependencias identificadas.`

---

## Riesgos Identificados (Sistema RAG)

| ID | Descripción | Severidad | Probabilidad | Categoría ISO 25010 | Mitigación |
|---|---|---|---|---|---|
| R-XX-01 | [Descripción del riesgo] | Alta/Media/Baja | Alta/Media/Baja | [Fiabilidad/Seguridad/...] | [Acción concreta] |

> **Leyenda:** Alta = puede bloquear el sprint · Media = impacta esfuerzo · Baja = manejable  
> Si no hay riesgos: `Sin riesgos identificados en este análisis.`

---

## Preguntas de Clarificación (ISO 29148: Completitud)

> ⚠️ **El PM debe responder estas preguntas antes de aprobar la historia.**

| # | Pregunta | Categoría | Impacto si no se responde |
|---|----------|-----------|--------------------------|
| 1 | [Pregunta concreta y accionable] | ISO 29148: [Inequívoco / Completo / Verificable] | [Alto / Medio / Bajo] |
| 2 | [Pregunta sobre umbral no especificado] | ISO 25010: [Eficiencia / Fiabilidad / Seguridad] | [Alto / Medio / Bajo] |

> Si no hay preguntas: `Sin preguntas de clarificación — historia completa según ISO 29148.`

---

## HITL — Feedback del PM

**Calificación ISO:** [N.N] / 5.0 — [Nivel]

**Estado de revisión:** ⏳ Pendiente / ✅ Aprobada / ❌ Rechazada

**Comentarios del PM:**
> _[El PM completa este campo en el dashboard HTML interactivo]_

**Fecha de revisión:** [DD/MM/YYYY HH:MM]

---

*Generado por: Requirement Refinator V1 — Sofka BU1*  
*Normativa: ISO/IEC/IEEE 29148:2018 · ISO/IEC 25010*  
*Template v2.0*
