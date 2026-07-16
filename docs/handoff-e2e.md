# Handoff: Playwright e2e suite for GazpachoScaler

Goal: e2e parity with gazpachator-bolt. Model on `gazpachator-bolt/playwright.config.ts` and `gazpachator-bolt/e2e/`.

## Setup

- `pnpm add -D @playwright/test`; scripts `test:e2e` / `test:e2e:ui`.
- Config: `webServer` runs `pnpm dev` (vite, port 5173); in CI build + `pnpm preview` so the `/GazpachoScaler/` base path is exercised (copy bolt's `GITHUB_ACTIONS` switch).
- CI: add an `e2e` job to `.github/workflows/ci.yml` mirroring bolt's (chromium only, report artifact on failure).

## Flows to cover

1. Page loads; default recipe shows 7 ingredients (`data-testid` selectors already exist per CLAUDE.md convention).
2. Changing an ingredient rescales the rest proportionally.
3. Recipe mode selector: original ↔ custom switch changes editing behavior.
4. Language switch updates text and persists across reload.
5. Theme toggle.
6. Counter increments and persists (localStorage).
7. JSON export downloads a file with the scaled amounts.
8. Print button opens print flow (assert `window.print` called via stub).

## Verification

`pnpm test:e2e` green locally and in CI, runtime under ~2 min.
