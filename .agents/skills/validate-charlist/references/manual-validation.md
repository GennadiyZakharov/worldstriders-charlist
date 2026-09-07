# Manual Validation Scenarios

## Automated Baseline First

1. Run `npm run test:e2e`.
2. Run `npm run test:visual`.
3. If baselines are intentionally changed, run `npm run test:visual:update` and re-run `npm run test:visual`.
4. Include pass/fail results and any screenshot diff artifacts in `artifacts/3_validate.md`.

## YAML Import/Export

1. Fill several fields (meta, skills, perks).
2. Export YAML.
3. Reset state.
4. Import exported YAML.
5. Verify values are restored as expected.

## Invalid YAML Safety

1. Attempt to import malformed YAML.
2. Verify app shows error.
3. Verify existing character data remains intact.

## Numeric Clamping

1. Import YAML with out-of-range numeric values.
2. Verify values clamp to expected limits.

## Language Coverage

1. Switch between EN and RU.
2. Verify changed labels are translated in both languages.

## Responsiveness

For UI/layout changes, use the [styling guide's evidence and acceptance criteria](../../../../docs/styling-guide.md#evidence-and-acceptance).

1. Inspect affected UI at 390px, 1440px, and a wide viewport such as 1920px in both EN and RU.
2. Check just below and above affected breakpoints (currently often 900px; use the actual component rules).
3. Confirm compact label/rating association, aligned ratings, clear category boundaries, full readable names, and no overlap or horizontal page overflow.
4. Check keyboard focus/order, secondary-action access, and text enlargement for affected controls.
5. Capture before/after evidence under `artifacts/screenshots/` and record viewport, language, outcomes, and limitations. Inspect a full-page view for global typography or section-order changes.
