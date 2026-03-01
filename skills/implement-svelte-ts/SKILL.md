---
name: implement-svelte-ts
description: Implement approved changes in this repository using Svelte 5 and strict TypeScript while preserving data normalization, i18n coverage, and offline single-file build constraints.
---

# Implement Svelte TS Skill

Use this skill when writing code after a plan is approved.

## Workflow

1. Read approved plan.
2. Confirm constraints from `AI_INSTRUCTIONS.md`.
3. Implement minimal changes.
4. If schema/model changes, update all required files together.
5. Run build and summarize results.
6. Prepare PR notes with what changed, why, and risks.

## Required Consistency Rules

- Model consistency:
  - `src/lib/types.ts`
  - `src/lib/model.ts` defaults
  - `normalizeCharacter()` path
- i18n consistency:
  - all UI strings in `src/lib/i18n.ts` for `en` and `ru`
- UI consistency:
  - avoid deprecated Svelte patterns
  - avoid self-closing non-void elements
  - keep components typed and focused

## References

Read `references/change-checklist.md` before finalizing edits.
