---
name: plan-change
description: Create a small, reviewable implementation plan for this Svelte/TypeScript RPG character list project, including scope, constraints, touched files, acceptance criteria, and validation steps.
---

# Plan Change Skill

Use this skill when the user asks to plan a feature, refactor, fix, or enhancement.

## Workflow

1. Read request and restate target behavior.
2. Read `AI_INSTRUCTIONS.md` and enforce constraints.
3. Produce a minimal one-PR plan using the template in `references/plan-template.md`.
4. Keep scope tight and explicitly list out-of-scope items.
5. Include validation commands and manual checks.

## Guardrails

- Prefer incremental changes over broad rewrites.
- Mention schema/model impact explicitly.
- If uncertain, propose a safe default path with lowest regression risk.

## Output

Return only the completed plan template sections with concise, actionable content.
