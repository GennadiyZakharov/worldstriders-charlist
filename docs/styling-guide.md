# WorldStriders Charlist Styling Guide

## Purpose and scope

Make the character sheet easy to scan during play: 
each label should clearly belong to its value or control, 
and related rows should form compact, recognizable groups at every screen size.

This is the shared styling reference required by [AGENTS.md](../AGENTS.md). 
Read it when planning, implementing, or reviewing UI/layout changes. 
Apply it to the task's affected UI; it does not authorize a full redesign or unrelated cleanup. 
Existing deviations are context, not automatic additions to the task. No schema/model changes are needed to apply these layout principles.

The outcome requirements below are the default for changed UI. 
Suggested dimensions and design directions are starting points to evaluate in the plan, 
not fixed acceptance thresholds. 
Record intentional deviations and their rationale in the relevant handoff artifact. 
Explicit user instructions take precedence.

## Visual references

- [PDF page 1](../artifacts/WorldStriders_20260906_104758.png): compact attribute groups, aligned ratings, vertical separators, 
  narrow skill lists, and mixed-width content areas.
- [PDF page 2](../artifacts/WorldStriders_20260906_104858.png): narrow notes beside wider tables, restrained rules, and clear section hierarchy.

These local artifacts may be absent in another checkout. 
When available, inspect them; otherwise use this guide and capture the current UI. 
Do not claim to have inspected missing images. 
Existing snapshots document an earlier layout, not a target that every redesign must reproduce.

## Grouping and width

### Outcome requirements

- Keep labels and their controls visibly associated. 
  Spare desktop width should primarily become outer margins or space between groups, 
  rather than an expanding void within each row.
- Align ratings vertically within each group using a shared label track sized for the group's labels. 
  Avoid independently placing dots immediately after each name, which produces a zigzag.
- Keep five-dot ratings compact and consistently sized. 
  Resolve layout problems in the containing row/group before changing the shared `DotRating` component.
- Allow writing areas and appropriate table columns to grow. 
  Give short numeric controls and stat groups bounded widths based on their content.

The current page already has a 1200px maximum content width. 
A page-width limit alone does not solve stretching inside it. 
Review parent grid tracks and row tracks together: 
unrestricted `1fr` label tracks combined with narrow inter-group gutters caused the original problem.

### Starting layout for attributes

```text
Intellect       ●○○○○     │     Magic          ●○○○○
Quick wits      ●○○○○     │     Luck           ●○○○○
Determination   ●○○○○     │     Body control   ●○○○○
```

Try attribute groups around 260–290px wide, 
with a modest label-to-rating gap and larger gutters between groups. 
Fit these values to the actual English and Russian text and available width; 
they are unverified starting dimensions. 
Center or evenly distribute bounded groups within the section. 
A shared grid or equivalent shared track sizing can preserve alignment 
without tying each row to the full section width.

## Skills and secondary actions

- Keep the checkbox, skill name, and rating easy to follow as one row. Align the checkbox, label, rating, and action columns consistently within each category.
- Prefer the order `checkbox → name → rating → specialization action` when redesigning skill rows, so the specialization button does not separate the name from its rating.
- Give the repeated specialization action less visual emphasis than the skill name and rating. A quieter text-button treatment is a useful starting point; retain a clear interactive affordance and visible focus.
- Keep specialization access visible without hovering and usable by keyboard and touch. Visual compactness must not come from shrinking usable hit areas or removing accessible names.
- On narrow layouts, let names wrap or put the secondary action on a second line. Keep the full skill name available in the normal layout; do not rely on ellipsis or hover-only tooltips to identify skills.

```text
□ Humanities         ○○○○○   Specs
□ Technical          ○○○○○   Specs
```

This is a layout sketch, not literal UI copy. 
Use existing localized labels and preserve the behavior of specialization dialogs and readonly mode.

## Separators, hierarchy, and visual character

- Borrow the PDF's thin teal vertical rules to separate desktop groups, with whitespace on both sides. For stacked groups, use spacing or a subtle horizontal rule. A divider supplements good spacing; it does not fix an overextended row by itself.
- Prefer restrained section boundaries. When border styling is in scope, reduce the emphasis of repeated rounded boxes, especially nested boxes, and use rules and whitespace to establish hierarchy.
- Reserve the strongest type treatment for section headings. Consider sentence case and reduced letter spacing for individual labels to improve readability and leave more room for content. Keep helper text quieter but legible.
- Use the shared typography definitions in `src/styles/typography.css`; keep component layout in local Svelte styles. Review global typography changes across their consumers rather than applying inconsistent local overrides.
- Borrow the PDF's proportions, alignment, and selective teal accents. Its textured background and highly condensed print lettering are not recommended defaults for the interactive UI. Preserve a clean reading surface and legible screen typography.

## Content arrangement

When section arrangement is explicitly in scope, consider bringing Skills directly below Attributes so related information is close during play. 
The PDF also suggests allocating narrow regions to compact stats and wider regions to notes or tables. 
Adapt these ideas to the app's interactions and responsive reading order; do not force the PDF's page geometry onto every screen.

Prioritize compact groups, aligned ratings, and clear category separation before broader typography, border, or section-order changes. 
Each change still follows the repository's scoped planning and approval workflow.

## Responsive behavior and localization

- Choose column counts and breakpoints according to whether actual content fits. Do not assume the current 900px breakpoint works for every section.
- Check both `en` and `ru`, including the longest labels. Preserve full names, readable spacing, and rating alignment without horizontal page overflow or overlapping controls.
- Retain bounded stat groups on wide screens. On narrow screens, stack or reflow groups and secondary actions while preserving the association between names and ratings.
- Preserve logical reading and keyboard order, visible focus, and touch usability when moving controls. Check text enlargement as well as viewport changes.
- Keep translations in `src/lib/i18n.ts` and assets local so the offline single-file build remains self-contained.

## Evidence and acceptance

For affected UI, the Planner defines concrete pass conditions and the Validator checks them against rendered evidence:

1. Labels and ratings read as one group; ratings do not appear attached to the next group's labels.
2. Ratings align within groups, and increasing viewport width does not cause unbounded label-to-rating separation.
3. Full names remain readable in both languages, without clipping, overlap, or horizontal page overflow.
4. Secondary actions remain discoverable and keyboard/touch usable; changed controls retain their expected behavior.
5. Separators and headings establish clear category boundaries in both side-by-side and stacked layouts.

Use the existing 390px mobile and 1440px desktop views, plus a wide view such as 1920px and widths immediately below and above any affected breakpoint. Capture both languages for affected sections; inspect a full-page view when changing global typography or section arrangement. Supplement screenshots with keyboard and text-enlargement checks relevant to the change.

Keep before/after screenshots and visual differences under `artifacts/`, preferably `artifacts/screenshots/`, and record viewport, language, observed outcomes, and any limitations in the handoff artifacts. Run the repository's required Playwright checks for UI changes. Inspect intended differences before updating baselines; an updated snapshot alone does not establish good layout. Document missing browsers or other runtime blockers and the checks that remain unverified.
