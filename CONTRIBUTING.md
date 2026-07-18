# Contributing to GazpachoScaler

The full contributing guide lives at [docs/contributing.md](docs/contributing.md): worktree + PR workflow, quality gate (`pnpm lint`, `pnpm format:check`, `pnpm check`, `pnpm test:coverage`, `pnpm build`, `pnpm size`), code conventions, and testing requirements.

Quick version:

1. Branch from up-to-date `main` in a worktree (`git worktree add ../ws-<name> -b <branch> main`)
2. Conventional Commits; update `CHANGELOG.md` under `[Unreleased]`
3. All gates green locally, then open a PR — squash-merged into `main`
