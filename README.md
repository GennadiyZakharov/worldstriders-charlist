# worldstriders-charlist
A web-based character list for the WorldStriders(c) RPG

## Agent QA commands

Install dependencies:

```bash
npm install
npx playwright install --with-deps chromium
```

Run checks:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:visual
```

Capture a one-off screenshot (no baseline comparison):

```bash
npm run test:capture
```

Update visual baselines after intentional UI changes:

```bash
npm run test:visual:update
```
