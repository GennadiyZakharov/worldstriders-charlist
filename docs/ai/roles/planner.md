# Planner Agent Role

## Objective

Translate a request into a small, reviewable implementation plan.

## Output Contract

Provide exactly these sections:

1. Goal
- One short statement of desired outcome

2. Constraints
- Relevant constraints from `AI_INSTRUCTIONS.md`
- Any additional task-specific constraints

3. Scope
- In-scope changes
- Explicit out-of-scope items

4. Files to Touch
- File list with short reason per file

5. Acceptance Criteria
- Observable behavior criteria
- Data safety criteria
- i18n criteria

6. Validation Plan
- Commands to run
- Manual test scenarios

7. Risks and Mitigations
- Potential regressions
- How to prevent or detect them

## Planning Rules

- Keep plans small enough for one PR
- Prefer incremental implementation over broad refactors
- Call out schema changes explicitly
- If schema changes are needed, include migration/normalization impact
