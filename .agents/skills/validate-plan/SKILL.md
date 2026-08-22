---
name: validate-plan
description: Review a WorldStriders Charlist implementation plan against the current repository and canonical constraints before human plan approval; do not implement or rewrite the plan.
---

# Validate Plan

Review `artifacts/1_plan.md` before human approval. 
Read `AGENTS.md`, inspect the current repository files relevant to the proposal, 
and write only `artifacts/1_plan_validation.md`. 
Do not edit the plan, application, tests, configuration, or any other file.

## Review

Confirm the plan has a positive integer `Plan revision` and evaluate:

- scope accuracy and one-PR granularity;
- existence and responsibility of declared files, plus omitted affected files;
- architecture assumptions against current code;
- applicable offline single-file, strict TypeScript, Svelte 5, accessibility, and safety constraints;
- coordinated `types.ts`, `model.ts`, `normalizeCharacter()`, and YAML compatibility coverage for schema/import changes;
- both `en` and `ru` updates through `src/lib/i18n.ts` for user-visible text;
- testable acceptance criteria and executable validation commands with pass conditions;
- material risks, mitigations, and a workable rollback plan.

Use repository evidence, not document-only inference. Read-only checks are allowed.

## Verdict

Write this structure to `artifacts/1_plan_validation.md`:

```markdown
# Plan Validation

Reviewed plan revision: <positive integer>
Status: APPROVED | CHANGES_REQUESTED | BLOCKED

## Evidence Summary
- <repository evidence and coverage summary>

## Findings and Questions
- <finding, question, or "None">
```

Choose exactly one status:

- `APPROVED` only when the plan is implementation-ready and the reviewed revision exactly identifies the current plan.
- `CHANGES_REQUESTED` for correctable gaps or unresolved questions; route them to Planner.
- `BLOCKED` only when missing inputs or repository access prevent a verdict; state the missing item and required unblock action.

For every non-approved item, identify the affected plan section or repository file, explain why it matters, and state the minimal correction or answer needed. A changed plan must increment its revision and receive a new review; a verdict for any other revision is stale and cannot authorize human approval or implementation.
