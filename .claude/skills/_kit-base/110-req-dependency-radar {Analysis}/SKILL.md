---
name: req-dependency-radar
description: Analiza el set completo de historias de usuario para descubrir bloqueos lógicos, dependencias cruzadas entre módulos o servicios externos de Google/Firebase antes de pasar a desarrollo.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, planning, architecture, dependencies, radar]
---
# req-dependency-radar {Analysis} (v1.0)

> **"El fracaso de los sprints no ocurre en la ejecución, ocurre en las dependencias no mapeadas."**

## Purpose
Escanea un grupo de Historias de Usuario, Epics, o Especificaciones Funcionales (Bulk Scan) para modelar un grafo de dependencias lógico-técnicas. Determina la "Ruta Crítica" (Critical Path) y previene bloqueos de desarrollo (ej. intentar hacer un Dashboard antes de hacer el Auth o la ingesta en Firestore).

**When to use:** Durante el Sprint Planning, PI Planning, o Inception (después de tener el Spec Inicial).

## 1. The Physics
1. **Law of Inevitability:** Todo grafo de requerimientos tiene un punto de fallo único si no se desarrolla en secuencia correcta.
2. **Law of External Forces:** Toda dependencia con un servicio third-party (ej. Aprobación OAuth de Google, DNS propagación) o external team (Diseño/Legal) añade un multiplicador de x5 al riesgo.
3. **Law of Isolation:** Las dependencias circulares (A depende de B, B de C, C de A) deben romperse obligatoriamente antes de llegar a código.

## 2. The Protocol
### Phase 1: Bulk Ingestion
1. Recibe un lote de historias o requerimientos.
2. Extrae sustantivos (Entidades de Datos) y verbos (Mutaciones/Operaciones).

### Phase 2: Graph Generation
1. Cruza las historias para armar el Grafo de Dependencia Dirigido (A -> B -> C).
2. Identifica dependencias **Funcionales**, **Técnicas** (Ej. Requiere habilitar Cloud Tasks), y **Operacionales** (Ej. Configurar env vars de Stripe).

### Phase 3: Critical Path Output
1. Genera un Diagrama de Gantt o Flujo estructurado en formato Mermaid indicando la Ruta Crítica.
2. Etiqueta cada historia con: `Ready`, `BlockedBy: US-X`, o `ExternalBlocker`.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Batch of US/Specs | JSON/Markdown | Yes | Lote de requerimientos a analizar |
| Output | Type | Description |
|--------|------|-------------|
| Dependency Radar | Markdown | Mermaid graph, Critical Path y Blocker list |

## 4. Quality Gates
- [ ] No existen dependencias circulares en el grafo resultante.
- [ ] Hay al menos un diagrama Mermaid listando el orden de ejecución (`graph TD`).
- [ ] Todas las dependencias técnicas de infraestructura (ej. "Setting up Firestore Emulator") se añaden explícitamente al inicio.

## 5. Self-Correction Triggers
> [!WARNING]
> IF se detecta que dos historias se bloquean mutuamente (Circular Dependency), THEN el radar debe detenerse y lanzar alerta forzando al Scrum Master/Analista a refactorizar una de las historias.
