# WorldStriders Character List — Project Rules for AI

You are assisting with development of **worldstriders-charlist**.

Always follow these rules unless explicitly told otherwise.

---

## Project goal
A single-page character list application for the live role-playing game **WorldStriders**.

The application must:
- work fully offline
- build into a single HTML file
- store and exchange character data safely

---

## Technology stack (fixed)
- Svelte + Vite + TypeScript
- `vite-plugin-singlefile` for production build
- No backend, no server, no runtime network access
- YAML import/export using `js-yaml`
- Browser persistence via `localStorage`

Do NOT propose alternative frameworks or servers.

---

## Critical constraints (non-negotiable)

1.**Stable data model**
   - Canonical types live in `src/lib/types.ts`
   - Default values and migrations live in `src/lib/model.ts`
   - Every loaded object MUST pass through `normalizeCharacter()`

2.**YAML compatibility**
   - Import/export must preserve all known fields
   - Unknown fields must not break loading
   - YAML format is machine-oriented for now

3.**Dual language**
   - UI must support English (`en`) and Russian (`ru`)
   - All user-visible strings go through `src/lib/i18n.ts`

---

## Coding rules
- TypeScript `strict: true`
- Avoid `any`; prefer `unknown` + explicit narrowing
- Keep all mutable state inside one `character: Character` object
- Components should be small and reusable
- Prefer explicitness over cleverness

---

## UX rules
- All numeric stats must be clamped (min/max)
- Import errors must show a clear message and never corrupt existing state

---

## When making changes
Before writing code:
1. Briefly state what will change and why
2. List affected files

When writing code:
- Mention schema changes explicitly

---

## Forbidden actions
- Do NOT add servers or APIs
- Do NOT add runtime network access
- Do NOT replace Svelte or Vite
- Do NOT silently change the data schema
