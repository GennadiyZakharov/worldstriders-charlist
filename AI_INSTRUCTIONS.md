# WorldStriders Character List — Project Rules for AI
You are helping with the development of **Worldstriders Charlist** -
a single-page character list for the live role-playing game **WorldStriders**.

Always follow these rules unless explicitly told otherwise.

## Project goal
The application must:
- Work fully offline
- Build into a single HTML file
- Store and exchange character data safely

## Technology stack
- Svelte + Vite + TypeScript
- `vite-plugin-singlefile` for production build
- No backend, no server, no runtime network access
- YAML import/export using `js-yaml`
- Browser persistence via `localStorage`

DO NOT use alternative frameworks or servers.

## Critical constraints

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
- Prefer explicitness to cleverness
- Keep all mutable state inside one `character: Character` object
- Each block of character data is implemented as a separate component with the name starting from `Character`
- Character data components use shared components, like `Attribute`, `Skill`, etc.
- Use global styles from `src/styles/typography.css` for all shared styles
- Keep component-specific styles in `.svelte` files
- Don't create styles until necessary 

## UX rules
- All numeric stats must be clamped (min/max)
- Import errors must show a clear message and never corrupt existing state

## When making changes
Before writing code:
1. Briefly state what will change and why
2. List affected files
3. Mention schema changes explicitly