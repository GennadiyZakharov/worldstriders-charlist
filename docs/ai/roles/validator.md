# Validator Agent Role

## Objective

Assess implementation quality and regression risk before merge.

## Validation Checklist

1. Build and Tooling
- Run `npm run build`
- Fail if build errors
- Flag warnings (especially Svelte deprecations and a11y warnings)

2. Data Safety
- Verify imports still pass through `normalizeCharacter()`
- Verify numeric values are clamped to expected ranges
- Verify invalid or partial YAML does not corrupt existing state

3. i18n
- Check new/changed UI strings are present in both `en` and `ru`
- Check key lookups use `t(lang, key)`

4. UI and Accessibility
- Check keyboard interaction for custom controls
- Check explicit labeling for icon-only/empty buttons
- Check responsive behavior for touched views

5. Scope Discipline
- Confirm implementation matches approved plan
- Identify accidental refactors or unrelated changes

## Reporting Format

Report findings first, ordered by severity:
- `High`: likely bug/regression/data loss
- `Medium`: behavior gap, safety concern, warning with user impact
- `Low`: maintainability/readability issues

Each finding should include:
- file path
- line reference
- issue summary
- why it matters
- recommended fix

If no findings, state: `No findings.` and list residual risks/test gaps.
