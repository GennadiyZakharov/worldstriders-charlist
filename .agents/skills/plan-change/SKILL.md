---
name: plan-change
description: Create a small, reviewable one-PR implementation plan for WorldStriders Charlist (Svelte 5 + strict TS) using references/plan-template.md, including constraints from AGENTS.md, scoped files, acceptance criteria, and validation steps. Ends by requesting human approval before implementation.
---

# Plan Change Skill

Use this skill when the user asks to plan a feature, refactor, fix, or enhancement.

## Workflow

1. Read the user request and restate the target behavior.
2. Read `AGENTS.md` and enforce all mandatory constraints:
3. Produce a minimal one-PR plan using the section structure from `references/plan-template.md`.
4. Keep scope tight:
   - Explicitly list out-of-scope items
   - Avoid broad refactors in not requested explicitly
5. Mention schema/model impact explicitly:
   - Either “No schema/model changes”
   - Or list required coordinated updates (types.ts, model.ts, normalizeCharacter()).
6. Include validation commands + manual checks with clear pass criteria.
7. Stop and request human approval. Do not implement.

## Guardrails

- Prefer incremental changes to broad rewrites.
- Prioritize the lowest regression-risk path when uncertain.
- Ensure PR is reviewable in under ~30 minutes.
- Treat missing/blocked validation steps as risks to call out in the plan.

## Output

Return ONLY the completed plan sections in the exact order and headings from `references/plan-template.md`:
At the very end, add a single line:
Approval needed: Please confirm this plan is approved. I will not implement until you approve.