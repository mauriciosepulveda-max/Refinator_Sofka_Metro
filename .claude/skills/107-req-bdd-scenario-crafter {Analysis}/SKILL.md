---
name: req-bdd-scenario-crafter
description: Expande las historias de usuario complejas en escenarios hiper-detallados de Behavior-Driven Development (Given/When/Then), cubriendo edge cases y happy paths.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, bdd, criteria, given-when-then, edge-cases]
---
# req-bdd-scenario-crafter {Analysis} (v1.0)

> **"La ambigüedad muere cuando el comportamiento se define exactamente."**

## Purpose
Tomar historias de usuario en formato estándar y detallarlas con escenarios BDD rigurosos que sirven como criterios de aceptación exactos y pruebas automatizables. Cubre *Happy Paths*, *Alternate Paths* y *Exception Paths*.

**When to use:** Justo después de redactar o refinar una User Story, antes de pasarla a la fase de especificación (Spec) o Desarrollo.

## 1. The Physics
1. **Law of State (Given):** Cada escenario debe tener un estado inicial perfectamente reproducible (sin dependencias ocultas).
2. **Law of Action (When):** Solo un evento o acción principal por escenario.
3. **Law of Verification (Then):** Consecuencias claras y afirmaciones (assertions) deterministas.

## 2. The Protocol
### Phase 1: Ingestion
1. Toma la Historia de Usuario (`As a [role], I want [feature], so that [benefit]`).
2. Identifica reglas de negocio explícitas o implícitas.

### Phase 2: Scenario Expansion
1. Genera 1 escenario `Happy Path` (Todo funciona perfecto).
2. Genera 1-3 escenarios `Alternate Paths` (El usuario comete un error menor o toma una ruta no convencional).
3. Genera 1-3 escenarios `Exception/Edge Cases` (Errores de red, validaciones de seguridad, límites de base de datos como Firestore permissions).

### Phase 3: Formatting
1. Aplica sintaxis Gherkin estricta (`Given`, `And`, `When`, `Then`, `And`).
2. Verifica que los escenarios no violen restricciones arquitectónicas (ej. Firebase R/W limits).

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| User Story | Text | Yes | La historia base |
| Business Rules | Text | No | Reglas adicionales de validación |
| Output | Type | Description |
|--------|------|-------------|
| BDD Scenarios | Markdown/Gherkin | Escenarios detallados listos para testing |

## 4. Quality Gates
- [ ] Hay al menos un Happy Path y un Error Path.
- [ ] La sintaxis Gherkin es perfectamente válida.
- [ ] Las precondiciones (Given) definen el estado de datos en Firestore/Auth si aplica.

## 5. Self-Correction Triggers
> [!WARNING]
> IF la cláusula THEN incluye múltiples variaciones lógicas (ej. u ocurre esto O aquello), THEN divide el escenario en dos escenarios separados.
