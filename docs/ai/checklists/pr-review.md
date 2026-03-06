# Manual PR Review Checklist

Use this checklist for every agent-generated PR.

## 1) Scope and Intent
- PR solves one clear task
- Description matches actual code changes
- No unrelated files changed

## 2) Correctness
- Behavior matches acceptance criteria
- Edge cases are handled
- No obvious runtime errors

## 3) Data Model Safety
- `types.ts`, defaults, and normalization stay consistent
- Imports still use `normalizeCharacter()`
- Numeric bounds are enforced

## 4) i18n Completeness
- All new user-visible strings are in `en` and `ru`
- Components use translation keys, not hardcoded text

## 5) Svelte + TypeScript Quality
- Strong typing, minimal casting
- No deprecated Svelte patterns added
- A11y concerns addressed for custom controls

## 6) Validation Evidence
- Build output included
- Lint/typecheck output included
- Playwright smoke (`npm run test:e2e`) result included
- Playwright visual regression (`npm run test:visual`) result included
- Manual test scenarios and results included
- Any remaining warnings explained

## 7) Learning Notes
- Agent explains why specific Svelte/TS approach was chosen
- Tradeoffs are stated clearly
