---
name: story-refiner
description: Transforms raw requirements or gap-diagnosed documents into perfect User Stories meeting the INVEST standard with BDD acceptance criteria.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [analysis, user-stories, refinement, bdd, invest]
---
# story-refiner {Analysis} (v1.0)

> **"A story well told is a feature half-built. INVEST in clarity."**

## Purpose
Takes raw requirements (from `req-discovery`) or gap-diagnosed documents (from `req-diagnostics`) and refines them into perfect User Stories. Enforces the INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable) and generates BDD format (Given/When/Then) acceptance criteria.

**When to use:** When transitioning from high-level epics/specs to actionable development tasks.

## 1. The Physics
1. **Law of INVEST:** Any story that violates I.N.V.E.S.T characteristics must be split or rewritten.
2. **Law of BDD:** Acceptance Criteria ONLY exist in Given/When/Then format. No bullet-point vague lists.
3. **Law of Value:** The "so that..." clause must state actual business value, not just a technical outcome.

## 2. The Protocol
### Phase 1: Ingestion
1. Read the provided Epics, raw requirements, or diagnosed legacy stories.
2. Review diagnostic outputs (if applicable) to ensure all questions were answered.

### Phase 2: Shaping
1. Split large requirements into 'Small' and 'Independent' stories.
2. Draft the Title and Description: `As a [Role], I want [Action], so that [Value]`.

### Phase 3: Acceptance Criteria Generation
1. Write primary happy path in Given/When/Then.
2. Write unhappy paths and edge cases (error states, permissions).
3. Validate against Firebase/Google stack constraints (ensure technical feasibility).

## 3. Inputs / Outputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Draft Specs | Markdown | Yes | Raw stories, Epics, or Diagnostic reports |
| Output | Type | Description |
|--------|------|-------------|
| Refined Backlog | Markdown | Ready-to-build User Stories with BDD ACs |

## 4. Quality Gates
- [ ] All stories pass the INVEST self-check.
- [ ] Every story has at least one unhappy path in its Acceptance Criteria.
- [ ] No technical implementation jargon in the "I want" clause.

## 5. Self-Correction Triggers
> [!WARNING]
> IF a story contains "and" in the action ("I want to login and view my profile"), THEN split it into two stories (violates 'Small' and 'Independent').
> IF acceptance criteria are not in BDD format, THEN rewrite them.
