# WorldStriders Character List — Project Rules for AI
You are helping with the development of **worldstriders-charlist** -
A single-page character list application for the live role-playing game **WorldStriders**.

Always follow these rules unless explicitly told otherwise.

## Project goal
The application must:
- work fully offline
- build into a single HTML file
- store and exchange character data safely

## Technology stack (fixed)
- Svelte + Vite + TypeScript
- `vite-plugin-singlefile` for production build
- No backend, no server, no runtime network access
- YAML import/export using `js-yaml`
- Browser persistence via `localStorage`

DO NOT use alternative frameworks or servers.

## Critical constraints (non-negotiable)

1.**Stable data model**
   - Canonical types live in `src/lib/types.ts`
   - Default values live in `src/lib/model.ts`
   - Every loaded object MUST pass through `normalizeCharacter()`

2.**YAML compatibility**
   - Import/export must preserve all known fields
   - Unknown fields must not break loading

3.**Dual language**
   - UI must support English (`en`) and Russian (`ru`)
   - All user-visible strings go through `src/lib/i18n.ts`

## Coding rules
- TypeScript `strict: true`
- Avoid `any`; prefer `unknown` + explicit narrowing
- Prefer explicitness over cleverness
- Keep all mutable state inside one `character: Character` object
- Use global styles from `src/styles/typography.css` for all font styles
- Keep component-specific styles in `.svelte` files

## UX rules
- All numeric stats must be clamped (min/max)
- Import errors must show a clear message and never corrupt existing state

## When making changes
Before writing code:
1. Briefly state what will change and why
2. List affected files

When writing code:
- Mention schema changes explicitly