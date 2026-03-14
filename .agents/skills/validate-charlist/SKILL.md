---
name: validate-charlist
description: Validate changes in the WorldStriders character list project by running build/lint/type checks, Playwright UI and visual regression checks, and reviewing data-model safety and i18n completeness.
---

# Validate Charlist Skill

Use this skill when asked to review or validate implementation quality.

## Workflow

1. Run `.agents/skills/validate-charlist/scripts/validate.sh` for baseline checks.
2. Read `artifacts/1_plan.md` and `artifacts/2_implement.md` before reviewing the changes.
3. Review changed files for model, i18n, and Svelte warning risks against the approved plan and implementation summary.
4. Confirm Playwright smoke and visual checks passed or report why they are blocked.
5. Save the validation report to `artifacts/3_validate.md`.
6. Report findings by severity with file/line references.
7. If no findings, state that explicitly and note residual risks.

## Required Checks

- Build succeeds (`npm run build`)
- Lint/type checks succeed (`npm run lint`, `npm run typecheck`)
- Playwright smoke checks succeed (`npm run test:e2e`)
- Playwright visual regression checks succeed (`npm run test:visual`)
- Warnings are captured and called out
- Data model consistency across `types.ts` and `model.ts`
- Imported data still normalizes through `normalizeCharacter()`
- i18n updates cover both `en` and `ru`

If visual snapshots are newly introduced or intentionally updated:
- Require explicit baseline update evidence (`npm run test:visual:update`)
- Treat unexplained snapshot drift as a Medium+ finding depending on impact

## Reporting Format

- High / Medium / Low findings
- Each finding: file, line, issue, impact, recommended fix, validation evidence
- Include a short status summary at the top of `artifacts/3_validate.md` covering plan compliance, checks run, blocked checks, and residual risks

## References

For manual validation scenarios, see `references/manual-validation.md`.
