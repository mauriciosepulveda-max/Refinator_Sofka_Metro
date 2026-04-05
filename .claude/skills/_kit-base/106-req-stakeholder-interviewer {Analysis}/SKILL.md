---
name: req-stakeholder-interviewer
description: Genera guiones de entrevistas, cuestionarios y agendas de workshops adaptadas al perfil del stakeholder (Negocio vs. Técnico) para extraer requerimientos ocultos.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, requirements, interview, stakeholder, elicitation]
---
# req-stakeholder-interviewer {Analysis} (v1.0)

> **"El requerimiento más importante es el que el stakeholder olvida mencionar."**

## Purpose
Extraer requerimientos implícitos y críticos de los stakeholders. Genera herramientas de elicitación (guiones, cuestionarios, dinámicas de workshop) adaptadas a perfiles específicos (C-Level, Técnico, Operativo, Usuario Final).

**When to use:** Durante Inception o cuando se identifican brechas de conocimiento en un dominio específico.

## 1. The Physics
1. **Law of the Profile:** Nunca usar el mismo set de preguntas para un CEO que para un Desarrollador. Adapta el lenguaje y el enfoque.
2. **Law of the "Why":** Cuestiona el "Por qué" detrás de cada "Qué" hasta llegar a la raíz del problema de negocio (Técnica de los 5 Porqués).
3. **Law of Silence:** El guión debe incluir momentos de pausa para permitir que el stakeholder hable libremente. Busca lo no dicho.

## 2. The Protocol
### Phase 1: Context & Profiling
1. Recibe el objetivo del proyecto o módulo.
2. Identifica el perfil del stakeholder (Categoría RACI, Técnico vs Negocio).
3. Analiza suposiciones actuales basadas en el "Assumption Log".

### Phase 2: Generation
1. Construye un `Interview Script` con 3 fases: Rompehielo (Contexto), Exploración Profunda (Core Questions), Cierre (Validación).
2. Formula preguntas abiertas que eviten sesgos de confirmación.
3. Si es un Workshop, diseña la agenda y las dinámicas (ej. User Story Mapping inicial).

### Phase 3: Validation
1. Asegura que las preguntas apunten directamente a los objetivos de negocio y restricciones técnicas del ecosistema (Firebase/Google/Hostinger).

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Stakeholder Profile | Text | Yes | Rol, influencia, conocimiento técnico |
| Project Goal | Text | Yes | Qué se busca construir |
| Output | Type | Description |
|--------|------|-------------|
| Elicitation Guide | Markdown | Guión de entrevista, preguntas clave y red flags a observar |

## 4. Quality Gates
- [ ] Las preguntas no son sugerentes (leading questions).
- [ ] El tono está ajustado al perfil del stakeholder.
- [ ] Cubre al menos 2 vectores de riesgo (Negocio, Técnico, Operativo).

## 5. Self-Correction Triggers
> [!WARNING]
> IF el guión parece un interrogatorio técnico para un perfil de Negocio, THEN reescríbelo enfocándote en ROI y flujos de valor.
