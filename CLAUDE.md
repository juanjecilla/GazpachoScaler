# CLAUDE.md

## Project

GazpachoScaler — static React SPA for calculating Andalusian gazpacho recipe proportions.

Live: https://juanjecilla.github.io/GazpachoScaler/

No backend. Counter is localStorage-only. See [docs/future-supabase-migration.md](docs/future-supabase-migration.md) for global counter migration.

## Commands

```bash
npm run dev            # Vite dev server → localhost:5173
npm run build          # tsc --noEmit + vite build (production)
npm run preview        # preview production build → localhost:4173
npm run lint           # ESLint — 0 warnings = CI gate
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier format all files
npm run format:check   # Prettier check (CI gate)
npm run check          # tsc --noEmit
npm run test           # Vitest single pass
npm run test:watch     # Vitest watch mode
npm run test:coverage  # coverage report (threshold: 70% on core files)
```

## Key files

```
client/src/lib/recipe-calculator.ts   pure calculation logic (no React)
client/src/hooks/use-recipe.ts        React state wrapper for calculator
client/src/hooks/use-counter.ts       localStorage counter read/write
client/src/lib/translations.ts        i18n strings (4 languages)
client/index.html                     HTML entry point
vite.config.ts                        Vite + Vitest config (base path, test setup)
```

## Architecture

- All source: `client/src/`
- Shared TypeScript types: `shared/schema.ts` (reference only, not runtime)
- `server/` is archived — Express backend, no longer used
- Vite `base = /GazpachoScaler/` in production — required for GitHub Pages subpath routing
- Tests mirror `src/` structure under `client/src/test/`

## Conventions

- Prettier: single quotes, 100 char line width, ES5 trailing commas, tailwindcss plugin
- ESLint: `--max-warnings 0` in CI (flat config, v9)
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`)
- No default exports except page components (`home.tsx`, `not-found.tsx`)
- `data-testid` on all interactive elements — used by Vitest/Testing Library

## Git worktrees

One worktree per feature branch, placed as siblings of the main checkout:

```bash
git worktree add ../ws-<name> -b <branch-name> main
cd ../ws-<name> && npm ci
# ... work ...
git worktree remove ../ws-<name>
git branch -d <branch-name>
```

Each phase PR is squash-merged into `main`. Create new branches from updated `main` (not from previous phase).

## Do not touch

- `client/src/components/ui/` — shadcn/ui generated. Add components with `npx shadcn add <component>`
- `.husky/pre-commit` — managed by Husky, edit via `package.json` lint-staged config
- `vite.config.ts` `repoName` constant — tied to GitHub repo name and Pages URL

## Deployment

Push to `main` → GitHub Actions → GitHub Pages automatically.
Repo must be **public**. GitHub Pages source must be set to **GitHub Actions**.
