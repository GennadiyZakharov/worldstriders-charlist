# WorldStriders Charlist — Canonical Agent Instructions

This file is the single source of truth for how agents must work in this repository.

## Project Overview

You are helping develop **WorldStriders Charlist**, a single-page character list for the live role-playing game **WorldStriders**.

### Project goals (non-negotiable)
- Works fully offline
- Builds into a single HTML file
- Stores and exchanges character data safely

## Technology Stack (fixed)
- Svelte 5 + Vite + TypeScript (strict)
- `vite-plugin-singlefile` for production build
- No backend, no server, no runtime network access
- YAML import/export using `js-yaml`
- Browser persistence via `localStorage`

Do not introduce alternative frameworks, servers, or runtime network dependencies.

## Collaboration Workflow

### Required roles
1) **Planner**
- Produces a scoped implementation plan
- Identifies affected files
- Defines acceptance criteria + validation steps

2) **Coder**
- Implements only the approved plan
- Keeps changes minimal and focused
- Preserves model safety, i18n, and offline constraints

3) **Validator**
- Runs required checks
- Reviews implementation quality (model safety, i18n completeness, Svelte warnings)
- Reports findings by severity with file/line references when possible

### Required sequence
1) Planner creates a task plan
2) Human reviews and approves plan
3) Coder implements the approved plan in one branch/PR
4) Validator runs checks and reports findings
5) Human performs final PR review and merge decision

### PR granularity rules
- One task per PR
- Avoid multi-feature PRs
- Prefer changes reviewable in under 30 minutes
- Use a local branch for a PR (no GitHub access)

## Mandatory Engineering Constraints

### Data model stability (critical)
- Canonical types live in `src/lib/types.ts`
- Default values live in `src/lib/model.ts`
- Every loaded object MUST pass through `normalizeCharacter()`
- Do not bypass normalization for imported data

### YAML compatibility
- Import/export must preserve all known fields
- Unknown fields must not break loading

### i18n (dual language required)
- UI must support English (`en`) and Russian (`ru`)
- All user-visible strings MUST go through `src/lib/i18n.ts` (update both `en` and `ru`)

## Coding Rules

### TypeScript
- Strict mode required (`strict: true`)
- Avoid `any`; prefer `unknown` + explicit narrowing
- Prefer explicitness to cleverness

### State & components
- Keep mutable state inside one `character: Character` object
- Character data blocks should be separate components, usually prefixed with `Character`
- Use shared leaf components (`Attribute`, `Skill`, etc.) for repeated UI behavior
- Use global typography styles from `src/styles/typography.css`
- Keep component-specific layout styles in local `.svelte` `<style>` blocks

## Svelte 5 Rules
- Prefer non-deprecated Svelte 5 patterns
- Type props with a local `Props` type or interface and destructure as `let { ... }: Props = $props();`
- Keep derived values in `$derived(...)` and side effects in `$effect(...)`
- Avoid self-closing non-void HTML elements (e.g. `<button />`)

## UX and Safety Rules
- All numeric stats must be clamped (min/max)
- Import errors must show a clear message and never corrupt the existing state
- Interactive controls must satisfy basic a11y checks (`aria-label`, keyboard usage)

## Definition of Done (DoD)

A change is complete only when all are true:
- `npm run build` passes
- No new Svelte warnings were introduced
- If UI text changed: both `en` and `ru` dictionaries updated in `src/lib/i18n.ts`
- If schema/model changed: `types.ts`, defaults (`model.ts`), and normalization updated together
- PR includes manual validation steps and outcomes

## Change Planning Protocol (Planner must follow)
Before writing code:
1) Briefly state what will change and why
2) List affected files
3) Mention schema/model changes explicitly (or state “no schema changes”)
4) Define acceptance criteria
5) Define validation steps (commands + what “pass” means)

## Required PR Content
Each PR must include:
- What changed and why
- Manual test steps and results
- Screenshots for UI changes
- Learning notes (Svelte/TypeScript reasoning)

Use `.github/pull_request_template.md`.

## Review Standards
- Correctness before style
- No hidden schema drift
- No unexplained tradeoffs
- Explicit handling of warnings and edge cases

## Forbidden Changes (hard bans)
- No backend endpoints, databases, or network APIs
- No runtime dependency on external services
- No direct use of parsed YAML/JSON objects without normalization
- No large refactor outside the agreed task scope
