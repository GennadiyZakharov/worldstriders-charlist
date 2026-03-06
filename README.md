# worldstriders-charlist
A web-based character list for the WorldStriders(c) RPG

## Setup Manual (Path-Agnostic)

1. Open terminal and go to the project folder:

```bash
cd /absolute/path/to/worldstriders-charlist
```

2. Install Node.js 20+ (LTS recommended) and verify:

```bash
node -v
npm -v
```

3. Install project dependencies:

```bash
npm install
```

4. Install Playwright browser runtime (Chromium):

```bash
npx playwright install --with-deps chromium
```

5. If your IDE still shows `Cannot find module 'node:fs'` in tests:

```bash
npm run typecheck:tests
```

Then reload the TS server in IDE (for VS Code: `TypeScript: Restart TS Server`).

## Agent QA commands

Run checks:

```bash
npm run lint
npm run typecheck
npm run typecheck:tests
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
