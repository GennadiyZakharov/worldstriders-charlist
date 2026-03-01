# WorldStriders Character List - Project Rules for AI

You are helping with the development of **Worldstriders Charlist**,
a single-page character list for the live role-playing game **WorldStriders**.

Always follow these rules unless explicitly told otherwise.

## Project Goal

The application must:
- Work fully offline
- Build into a single HTML file
- Store and exchange character data safely

## Technology Stack

- Svelte 5 + Vite + TypeScript
- `vite-plugin-singlefile` for production build
- No backend, no server, no runtime network access
- YAML import/export using `js-yaml`
- Browser persistence via `localStorage`

Do not use alternative frameworks or servers.

## Critical Constraints

1. Stable data model
- Canonical types live in `src/lib/types.ts`
- Default values live in `src/lib/model.ts`
- Every loaded object must pass through `normalizeCharacter()`

2. YAML compatibility
- Import/export must preserve all known fields
- Unknown fields must not break loading

3. Dual language
- UI must support English (`en`) and Russian (`ru`)
- All user-visible strings go through `src/lib/i18n.ts`

## Coding Rules

- TypeScript strict mode is required (`strict: true`)
- Avoid `any`; prefer `unknown` + explicit narrowing
- Prefer explicitness to cleverness
- Keep mutable state inside one `character: Character` object
- Character data blocks should be separate components, usually prefixed with `Character`
- Use shared leaf components (`Attribute`, `Skill`, etc.) for repeated UI behavior
- Use global typography styles from `src/styles/typography.css`
- Keep component-specific layout styles in local `.svelte` `<style>` blocks

## Svelte 5 Rules

- Prefer non-deprecated Svelte 5 patterns
- Do not introduce new deprecated `<slot>` usage; prefer render-snippet pattern where applicable
- Keep props fully typed in `$props<...>()`
- Keep derived values in `$derived(...)` and side effects in `$effect(...)`
- Avoid self-closing non-void HTML elements (for example `<button />`)

## UX and Safety Rules

- All numeric stats must be clamped (min/max)
- Import errors must show a clear message and never corrupt existing state
- Interactive controls must satisfy basic a11y checks (`aria-label`, keyboard usage)

## Definition of Done

A change is complete only when all are true:
- `npm run build` passes
- No new Svelte warnings were introduced
- If UI text changed, both `en` and `ru` dictionaries were updated
- If schema/model changed, `types.ts`, defaults, and normalization were updated together
- PR includes manual validation steps and outcomes

## Change Planning Protocol

Before writing code:
1. Briefly state what will change and why
2. List affected files
3. Mention schema changes explicitly
4. Define acceptance criteria

## Forbidden Changes

- No backend endpoints, databases, or network APIs
- No runtime dependency on external services
- No direct use of parsed YAML/JSON objects without normalization
- No large refactor outside the agreed task scope
