---
name: validate-charlist
description: Validate changes in the WorldStriders character list project by running build checks, reviewing warnings, and verifying data-model safety and i18n completeness.
---

# Validate Charlist Skill

Use this skill when asked to review or validate implementation quality.

## Workflow

1. Run `scripts/validate.sh` for baseline checks.
2. Review changed files for model, i18n, and Svelte warning risks.
3. Report findings by severity with file/line references.
4. If no findings, state that explicitly and note residual risks.

## Required Checks

- Build succeeds (`npm run build`)
- Warnings are captured and called out
- Data model consistency across `types.ts` and `model.ts`
- Imported data still normalizes through `normalizeCharacter()`
- i18n updates cover both `en` and `ru`

## Reporting Format

- High / Medium / Low findings
- Each finding: file, line, issue, impact, recommended fix

## References

For manual validation scenarios, see `references/manual-validation.md`.
