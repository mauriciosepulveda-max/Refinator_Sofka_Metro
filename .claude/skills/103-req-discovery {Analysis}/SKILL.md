---
name: req-discovery
description: Guide the requirements gathering process from scratch (Greenfield). Defines MVPs, key business flows, and actor mappings from raw briefs or meetings.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, discovery, greenfield, mvp, flows]
---
# req-discovery {Analysis} (v1.0)

> **"Structure from pure chaos. Map the unknowns before writing the first line of code."**

## Purpose
Guide the requirements gathering process from scratch (Greenfield). Takes raw briefs, meeting transcripts, or high-level business goals and extracts a structured domain, defining the MVP, key business flows, and actor mappings.

**When to use:** At the very beginning of a new project (MAO DNA, Phase 0/1).

## 1. The Physics
1. **Law of Focus:** If it does not serve the primary business goal, it goes to the backlog. The MVP remains minimal.
2. **Law of Actors:** Every flow must have a clearly defined initiator (Actor or System trigger).
3. **Law of Evidence:** Every defined feature must map back to a stated business goal or input brief statement [EVIDENCE].

## 2. The Protocol
### Phase 1: Elicitation and Structuring
1. Ingest raw inputs (briefs, RFPs, transcripts).
2. Identify core business objectives and constraints.

### Phase 2: Domain Mapping
1. Identify primary Actors (Users and external Systems).
2. Extract the Top 5 to 10 End-to-End Business Flows.
3. Discriminate MVP features from V2+ features.

### Phase 3: Deliverable Generation
1. Produce the Discovery Matrix: Actors, Flows, and MVP scope.
2. Draft high-level epics (not detailed user stories yet).

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Raw Briefs | Text/Files | Yes | Business ideas, RFP, transcripts |
| Output | Type | Description |
|--------|------|-------------|
| Discovery Blueprint | Markdown | Actors, MVP Scope, Epics, Main Flows |

## 4. Quality Gates
- [ ] Every flow has an assigned Actor.
- [ ] MVP scope is strictly separated from future iterations.
- [ ] The core business goal is explicitly stated at the top.

## 5. Self-Correction Triggers
> [!WARNING]
> IF an Epic cannot be traced back to the business goal, THEN flag it for removal or clarification.
> IF technical architecture decisions (databases, frameworks) are included, THEN remove them (strict MAO DNA phase separation).
