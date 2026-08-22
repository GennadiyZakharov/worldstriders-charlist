---
name: plan-change
description: Create and revise a numbered, reviewable one-PR implementation plan for WorldStriders Charlist, submitting it to Plan Validator before requesting human approval.
---

# Plan Change Skill

Use this skill when the user asks to plan a feature, refactor, fix, or enhancement.

## Workflow

1. Read the user request and restate the target behavior.
2. Read `AGENTS.md` and enforce all mandatory constraints:
3. Produce revision 1 of a minimal one-PR plan using the section structure from `references/plan-template.md`. For every later plan change, increment the revision.
4. Save the complete proposed plan to `artifacts/1_plan.md` and submit it to Plan Validator for `$validate-plan` review.
5. Keep scope tight:
   - Explicitly list out-of-scope items
   - Avoid broad refactors in not requested explicitly
6. Mention schema/model impact explicitly:
   - Either “No schema/model changes”
   - Or list required coordinated updates (types.ts, model.ts, normalizeCharacter()).
7. Include validation commands + manual checks with clear pass criteria.
8. For UI/layout-related tasks, include planning/analysis screenshot guidance:
   - Capture screenshots into `artifacts/screenshots/`
   - Treat them as review evidence (no commit required)
9. Handle `artifacts/1_plan_validation.md` by exact status:
   - `CHANGES_REQUESTED`: make the actionable corrections, increment the revision, save, and resubmit.
   - `BLOCKED`: resolve the named missing input/access. Human clarification may be requested for genuinely unresolved product intent, but is not plan approval. Increment and resubmit if the plan changes.
   - `APPROVED`: verify its reviewed revision matches the current plan revision, then request human approval.
10. Stop after the approval request. Do not implement.

## Guardrails

- Prefer incremental changes to broad rewrites.
- Prioritize the lowest regression-risk path when uncertain.
- Ensure PR is reviewable in under ~30 minutes.
- Treat missing/blocked validation steps as risks to call out in the plan.

## Output

Return ONLY the completed plan sections in the exact order and headings from `references/plan-template.md`:
Only after a matching Plan Validator `APPROVED` verdict, add this single line at the very end:
Approval needed: Please confirm this plan is approved. I will not implement until you approve.

Before that verdict, persist the plan without the approval line and route it to Plan Validator rather than presenting it for human plan approval.
