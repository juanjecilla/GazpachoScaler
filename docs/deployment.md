# Deployment

## Live URL

https://juanjecilla.github.io/GazpachoScaler/

## Automatic deployment

Every push to `main` triggers the deploy workflow:

```
git push origin main
  → .github/workflows/deploy.yml
    → pnpm install
    → pnpm build (NODE_ENV=production)
    → upload dist/ as GitHub Pages artifact
    → deploy to github-pages environment
```

Updates are live within ~2 minutes of pushing.

## Prerequisites (one-time setup)

1. **Repo must be public** — GitHub Pages is free only for public repos
2. **Enable GitHub Pages** — Settings → Pages → Source → **GitHub Actions**
3. No secrets required for the current localStorage build

## Local production preview

```bash
pnpm build    # produces dist/
pnpm preview  # serves at http://localhost:4173
```

## Vite base path

The Vite config sets `base: '/GazpachoScaler/'` when `NODE_ENV=production`.
This is required because GitHub Pages serves the app at a subpath.

Asset URLs in `dist/index.html` will look like `/GazpachoScaler/assets/index-xxx.js`.

**Do not change the repo name** without also updating `vite.config.ts`:

```ts
const repoName = 'GazpachoScaler';
```

## CI workflow

`.github/workflows/ci.yml` runs on every push to `main` and `phase/**` branches:

1. `pnpm lint` — ESLint with 0 warnings policy
2. `pnpm format:check` — Prettier check
3. `pnpm check` — TypeScript type check
4. `pnpm test` — Vitest test suite

All four must pass before a PR can be merged to `main`.
