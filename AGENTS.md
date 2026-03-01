# Agent Workflow for WorldStriders Charlist

This file defines how AI agents should collaborate on this repository.

## Purpose

Use different agents for different task types while keeping each change small,
reviewable, and educational for manual PR review.

## Required Roles

1. Planner Agent
- Produces a scoped implementation plan
- Identifies affected files and risks
- Defines clear acceptance criteria and validation steps

2. Coder Agent
- Implements only the approved plan
- Keeps changes minimal and focused
- Preserves model safety, i18n, and offline constraints

3. Validator Agent
- Reviews implementation output
- Runs required checks
- Reports findings by severity with file/line references

## Required Sequence

1. Planner creates a task plan
2. Human reviews and approves plan
3. Coder implements approved plan in one branch/PR
4. Validator runs checks and reports findings
5. Human performs final PR review and merge decision

## PR Granularity

- One task per PR
- Avoid multi-feature PRs
- Prefer changes that can be reviewed in under 30 minutes

## Mandatory Constraints

- Follow `AI_INSTRUCTIONS.md`
- Preserve single-file offline build
- Do not bypass `normalizeCharacter()` for imported data
- Keep all user-facing text in `src/lib/i18n.ts` (`en` and `ru`)

## Required PR Content

Each PR must include:
- What changed and why
- Files changed
- Risk and regression notes
- Manual test steps and results
- Screenshots for UI changes
- Learning notes (Svelte/TypeScript reasoning)

Use `.github/pull_request_template.md`.

## Review Standards

- Correctness before style
- No hidden schema drift
- No unexplained tradeoffs
- Explicit handling of warnings and edge cases
