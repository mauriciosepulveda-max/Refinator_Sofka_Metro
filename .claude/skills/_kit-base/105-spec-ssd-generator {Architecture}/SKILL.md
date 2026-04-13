---
name: spec-ssd-generator
description: Bridges product and technical architecture. Takes user stories and generates Software Specifications (Specs) and System Sequence Diagrams (SSD) using Mermaid.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, ssd, specs, sequence-diagrams, mermaid]
---
# spec-ssd-generator {Architecture} (v1.0)

> **"If it cannot be diagrammed, it cannot be built. Visualize the sequence."**

## Purpose
Acting as the bridge between product analysis and technical architecture, this skill takes refined User Stories and generates granular Software Specification Documents (Specs) along with System Sequence Diagrams (SSD). It maps exactly how actors and system components will interact to fulfill the story.

**When to use:** After User Stories have been refined, but before code implementation begins (Transition from MAO to SA DNA).

## 1. The Physics
1. **Law of Temporality:** Sequence diagrams must respect synchronous vs asynchronous realities (especially relevant for Firebase triggers/listeners).
2. **Law of Boundaries:** The SSD must expose boundaries (Frontend vs Firebase Auth vs Cloud Functions vs Firestore vs Third-party APIs).
3. **Law of Traceability:** Every Spec and SSD must reference the ID of the User Story it fulfills (e.g., US-001).

## 2. The Protocol
### Phase 1: Interpretation
1. Read the refined User Stories (BDD format).
2. Identify Actors, Triggers, Systems, and Data payloads for each story.

### Phase 2: Specification Mapping
1. Translate the Given/When/Then into precise system component interactions.
2. Outline the required Firestore operations, API calls, and Cloud Functions involved.

### Phase 3: Diagram Generation
1. Write the Specs in structured markdown.
2. Generate Mermaid `sequenceDiagram` code blocks representing the interaction flow.
3. Validate Mermaid syntax.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Refined Stories | Markdown | Yes | US with BDD Acceptance Criteria |
| Output | Type | Description |
|--------|------|-------------|
| SSD & Specs | Markdown | System Specification Document with Mermaid diagrams |

## 4. Quality Gates
- [ ] Every SSD includes explicit error paths (e.g., `alt` blocks in Mermaid).
- [ ] Mermaid syntax is flawless and renderable.
- [ ] Components align with the Firebase/Google architecture constraint.
- [ ] All external API calls are explicitly diagrammed.

## 5. Self-Correction Triggers
> [!WARNING]
> IF a diagram implies direct SQL database writes (violating Firebase constraints), THEN self-correct to Firestore interactions or Cloud Functions.
> IF Mermaid blocks are missing `alt` paths for errors, THEN append error scenarios.
