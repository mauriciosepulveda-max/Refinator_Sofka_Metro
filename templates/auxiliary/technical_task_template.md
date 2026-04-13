# Plantilla: Tarea Técnica

> **Uso:** Esta plantilla se usa para documentar cada tarea técnica derivada de una Historia de Usuario durante el refinamiento. Es el nivel más granular del artefacto de estimación. Una tarea técnica NO es una Historia de Usuario — es una unidad de trabajo del equipo de desarrollo.

---

## Identificación

| Campo | Valor |
|---|---|
| **ID Tarea** | `T-XX-YY` (XX = ID de US, YY = número secuencial) |
| **Historia Padre** | `US-XX — [Título de la historia]` |
| **Sprint Objetivo** | Sprint [N] |
| **Tipo** | BE / FE / QA / DB / DEVOPS / UX |
| **Asignado a** | [Squad / Persona / TBD] |
| **Estado** | Pendiente / En Progreso / Completada / Bloqueada |

---

## Descripción

**Título corto:** [Verbo en infinitivo + componente + objetivo]
> Ejemplo: "Implementar endpoint POST /api/auth/login con validación JWT"

**Descripción detallada:**
```
[Descripción técnica completa de qué debe implementarse.
Incluir: componente afectado, comportamiento esperado,
interfaces involucradas, y referencias a specs si aplica]
```

**Contexto técnico:**
- **Stack:** [React 18 / Spring Boot 3 / PostgreSQL / etc.]
- **Componente/Módulo:** [Nombre del módulo o microservicio]
- **Archivos/clases probables:** [/src/auth/AuthService.ts, etc.]
- **Patrones aplicables:** [Repository, Singleton, etc.]

---

## Criterio de Completitud (DoD de la Tarea)

> La tarea se considera COMPLETADA cuando:

- [ ] [Criterio técnico específico 1 — ej. "Endpoint responde HTTP 200 con token JWT válido"]
- [ ] [Criterio técnico específico 2 — ej. "Test unitario cubre los 3 flujos críticos"]
- [ ] [Criterio técnico específico 3 — ej. "PR aprobado por al menos 1 revisor"]
- [ ] Código hace merge exitoso en rama de desarrollo sin romper build
- [ ] Sin warnings de seguridad en el scanner estático

---

## Estimación

| Métrica | Valor |
|---|---|
| **Estimación optimista** | [N] horas |
| **Estimación esperada** | [N] horas ← _usar este valor_ |
| **Estimación pesimista** | [N] horas |
| **Estimación final usada** | **[N] horas** |

> ⚠️ **Nota obligatoria:** Esta es una estimación inicial generada por IA basada en el contexto técnico provisto. **Requiere validación y ajuste por el equipo de desarrollo antes de comprometerse con el cliente.**

**Factores de incertidumbre identificados:**
- [ ] Dependencia de servicio externo no probado
- [ ] Tecnología nueva para el equipo
- [ ] Requisito no completamente definido (ver Preguntas de Clarificación en US padre)
- [ ] Complejidad de integración con módulos existentes

---

## Dependencias de la Tarea

| Bloqueada por | Tipo | Descripción |
|---|---|---|
| `T-XX-YY` | Tarea | [Qué tarea debe completarse antes] |
| `US-ZZ` | Historia | [Qué historia previa es pre-requisito] |
| `[Servicio]` | Externo | [Disponibilidad de servicio / acceso a entorno] |

> Si no hay dependencias: `Sin dependencias de tarea.`

---

## Riesgos Específicos de la Tarea

| Riesgo | Impacto | Acción |
|---|---|---|
| [Descripción del riesgo] | Alto/Medio/Bajo | [Qué hacer si ocurre] |

---

## Notas del Equipo

> _[Este espacio es para anotaciones del equipo de desarrollo durante la ejecución. No completar en la fase de refinamiento.]_

**Impedimentos reportados:**
- [Fecha] [Persona]: [Descripción del impedimento]

**Decisiones técnicas tomadas:**
- [Fecha] [Persona]: [Descripción de la decisión y su razón]

---

## Trazabilidad

```
US-XX (Historia de Usuario)
  └── T-XX-YY (Esta tarea)
        └── PR#XXX (Pull Request — completar al cerrar)
              └── Commit: [hash] (completar al mergear)
```

---

*Generado por: Requirement Refinator V1 — Sofka BU1*
*Skill: user-story-refiner v1.0 — Sección de Tareas Técnicas*
