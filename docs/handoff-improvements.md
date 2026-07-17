# Handoff: improvements backlog — GazpachoScaler

From the 2026-07-17 cross-repo deep analysis. Tags: `static-ok` (prioritize) / `needs-backend` (deferred).

## static-ok (prioritized)

1. **Prune unused dependencies + shadcn files** — the Replit scaffold shipped ~30 `@radix-ui/*` packages, `recharts`, `embla-carousel-react`, `framer-motion`, `react-hook-form`, `wouter` etc.; the app uses a handful of `components/ui/*`. Main bundle is 328 KB raw / 106 KB gzip for a one-page calculator. Delete unused `client/src/components/ui/*` files, drop their deps, re-measure.
2. **Validate localStorage reads** — counter and any future persisted state parse without shape checks; add guards with defaults.
3. **Typed translation keys** — `t(key: string)` in `client/src/lib/translations.ts`; derive a key union type.
4. **Dependabot/Renovate** — add `.github/dependabot.yml`.
5. **Router leftovers** — `wouter` + `pages/not-found.tsx` exist for a single-page app on Pages subpath; either drop routing entirely or verify the 404 path actually works under `/GazpachoScaler/`.
6. **Bundle budget in CI** — add a size-limit step.
7. **Coverage excludes** — `vite.config.ts` excludes several real components (`actions-panel`, `language-selector`, pages) from coverage; write tests and shrink the exclude list instead.

## needs-backend (recorded, deferred)

- Global counter migration — full plan already written in `docs/future-supabase-migration.md`.
- Cross-device preset sync.

## Suggested skills

- `/simplify` after the dependency prune
- `/tdd` for the coverage-exclude shrink
