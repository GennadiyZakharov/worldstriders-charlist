---
name: implement-svelte-ts
description: Implement an approved one-PR plan in WorldStriders Charlist using Svelte 5 + strict TypeScript while preserving offline single-file build, normalizeCharacter() safety, and full en/ru i18n coverage.
---

# Implement Svelte TS Skill

Use this skill only when implementing code **after a human has approved a plan**.

## Workflow

1. Confirm approval
   - Locate the approved plan (usually produced by the Planner).
   - If approval is not explicit, STOP and request approval. Do not implement.

2. Re-check canonical constraints
   - Read `AGENTS.md` and confirm:
     - Offline + single HTML build constraints remain intact
     - All loaded/imported character data flows through `normalizeCharacter()`
     - Strict TypeScript rules (avoid `any`)
     - Svelte 5 non-deprecated patterns
     - i18n via `src/lib/i18n.ts` with both `en` and `ru`

3. Implement minimal changes
   - Implement only what the plan describes.
   - Keep the diff small and reviewable; avoid unrelated refactors.

4. Maintain required consistency (if applicable)
   - If schema/model changes:
     - Update ALL together:
       - `src/lib/types.ts`
       - `src/lib/model.ts` (defaults)
       - `normalizeCharacter()` (normalization path)
     - Ensure YAML import/export preserves known fields and tolerates unknown fields.

   - If UI text changes:
     - Add/update strings in `src/lib/i18n.ts` for both `en` and `ru`
     - Ensure lookups use the i18n helper (no hard-coded user-facing strings)

   - If numeric stats/inputs change:
     - Clamp values to expected min/max
     - Ensure invalid/partial YAML cannot corrupt existing state

5. Run required checks and record evidence
   - Always run:
     - `npm run build`
   - If available, also run:
     - `npm run lint`
     - `npm run typecheck`
   - If a command is blocked, note it in PR risks and explain what is needed to run it.

6. Prepare PR notes (required content)
   Use `.github/pull_request_template.md` and include:
   - What changed and why
   - Files changed
   - Manual test steps and results
   - Screenshots for UI changes
   - Learning notes (Svelte/TypeScript reasoning)

7. Final checklist
   - Read `references/change-checklist.md` and ensure all items are satisfied before concluding.