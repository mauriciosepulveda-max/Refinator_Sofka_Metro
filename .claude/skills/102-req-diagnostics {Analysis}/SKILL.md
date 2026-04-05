---
name: req-diagnostics
description: Analyze existing requirements, legacy user stories, or outdated docs to identify gaps, ambiguities, unvalidated assumptions, and contradictions.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, diagnostics, requirements, audit]
---
# req-diagnostics {Analysis} (v1.0)

> **"What is not written is forgotten; what is vague is a bug waiting to happen."**

## Purpose
Analyze existing requirements, raw user stories, or project documentation to identify gaps, ambiguities, unvalidated assumptions, and contradictions. Ideal for ongoing projects that need to refine their current state before continuing development.

**When to use:** During the analysis of an ongoing project or when inheriting legacy specs (MAO DNA).

## 1. The Physics
1. **Law of the Void:** Every missing edge case or unhappy path must be explicitly flagged.
2. **Law of Clarity:** Vague adjectives ("fast", "user-friendly", "robust") are treated as defects. They must be quantified.
3. **Law of Socratic Interrogation:** Instead of assuming, generate precise questions for the product owner.

## 2. The Protocol
### Phase 1: Ingest
1. Collect existing requirement docs, raw user stories, or Jira tickets.
2. Map current actors and system boundaries mentioned in the text.

### Phase 2: Diagnose
1. Evaluate completeness: Are unhappy paths covered? Are error states defined?
2. Evaluate clarity: Search for ambiguous terminology and unmeasurable acceptance criteria.
3. Evaluate consistency: Look for contradictions between different stories or rules.

### Phase 3: Report
1. Produce a Diagnostics Report mapping Findings to Evidence Tags.
2. Score the current state of requirements (0-100).
3. Output a list of Socratic questions needed to unblock refinement.

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Legacy Docs | Text/Markdown | Yes | Existing requirements, tickets, user stories |
| Output | Type | Description |
|--------|------|-------------|
| Diagnostics Report | Markdown | Contains the 0-100 score, gaps, and QA questions |

## 4. Quality Gates
- [ ] All vague terms have been flagged.
- [ ] At least one unhappy path question is generated per major flow.
- [ ] Output does NOT rewrite the stories (that is the refiner's job), strictly diagnoses them.

## 5. Self-Correction Triggers
> [!WARNING]
> IF the diagnostic report contains solutions or rewrites, THEN remove them. The goal is strictly identification of gaps and generation of clarifying questions.
