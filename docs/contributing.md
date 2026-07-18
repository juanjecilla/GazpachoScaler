# Contributing

## Prerequisites

- Node.js 22+
- Git

## Local setup

```bash
git clone git@github.com:juanjecilla/GazpachoScaler.git
cd GazpachoScaler
pnpm install
pnpm dev   # → http://localhost:5173
```

## Git workflow: worktrees

Each feature or phase gets its own branch and worktree so you can work on multiple things in parallel without switching branches:

```bash
# Create a new worktree for your feature
git worktree add ../ws-my-feature -b feature/my-feature main

cd ../ws-my-feature
ppnpm add         # each worktree needs its own node_modules
pnpm dev

# After merging, clean up
git worktree remove ../ws-my-feature
git branch -d feature/my-feature
```

List active worktrees:

```bash
git worktree list
```

## Code quality

A pre-commit hook runs automatically via Husky:

```
eslint --fix + prettier --write   (on staged .ts/.tsx files)
prettier --write                  (on staged .js/.json/.md/.css files)
```

CI also runs the full suite — a PR with lint failures will not be mergeable.

## Commit style

Conventional Commits:

- `feat:` new user-facing feature
- `fix:` bug fix
- `chore:` tooling, deps, config
- `docs:` documentation only
- `test:` tests only
- `refactor:` code change with no feature/fix

Keep subject ≤50 chars. Use the body for "why" when the reason isn't obvious.

## Pull requests

- Create from a feature branch (never commit directly to `main`)
- Squash-merge into `main` to keep history clean
- CI must pass before merging

## Adding a language

1. Open `client/src/lib/translations.ts`
2. Add the language key to the `Language` type: `'en' | 'es' | 'fr' | 'de' | 'pt'`
3. Add the flag and name to `LANGUAGE_FLAGS` and `LANGUAGE_NAMES` in `language-selector.tsx`
4. Copy the `en` translation object and translate all values
5. No backend change required

## Running tests

```bash
pnpm test           # single pass
pnpm test:watch     # watch mode
pnpm test:coverage  # coverage report
```

Tests live in `client/src/test/` mirroring the `src/` structure.
