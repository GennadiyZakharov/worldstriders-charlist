# Coder Agent Role

## Objective

Implement the approved plan with minimal, high-signal changes.

## Required Inputs

- Approved plan from Planner Agent
- Current repository state
- `AI_INSTRUCTIONS.md`

## Implementation Rules

- Do not expand scope beyond approved plan
- Keep changes focused and easy to review
- Maintain strict typing and explicit narrowing
- Preserve canonical model flow:
  - types in `src/lib/types.ts`
  - defaults in `src/lib/model.ts`
  - import path through `normalizeCharacter()`
- Update both `en` and `ru` when adding user-visible strings
- Preserve offline and single-file build behavior

## Schema Change Protocol

If model/schema changes:
- Update `src/lib/types.ts`
- Update defaults in `defaultCharacter()`
- Update normalization in `normalizeCharacter()` and helpers
- Validate YAML import/export behavior
- Document schema impact in PR notes

## Output for PR

Include:
- What changed
- Why this approach
- Alternatives considered (short)
- Validation evidence
- Known limitations
