# Handoff: features v2 backlog — GazpachoScaler

Goal: second feature round after the 2026-07-18 parity pass — shared new features (F1–F4, same IDs in every sibling repo), a11y/hygiene, doc refresh, and test gap-fill. **Static-ok only** (GitHub Pages, no backend). Keep this repo's parchment design language — port behavior, never visuals. Cross-repo context: `gazpachator-bolt/docs/ALIGNMENT.md` and each sibling's `docs/handoff-features-v2.md`.

Suggested execution order: **B1 first (buys bundle headroom) → B2–B4 → C → A (F1→F4)**. One worktree + PR per numbered item.

## Constraints

- Follow CLAUDE.md: worktree + PR flow (`../ws-<name>`), Conventional Commits, all 4 languages (`en`, `es`, `fr`, `de`) updated together with typed keys (`client/src/lib/translations.ts`), unit tests before PR, e2e for UI changes, coverage 80/75/80/80.
- `data-testid` on all new interactive elements; no default exports except page components; never hand-edit `client/src/components/ui/*`.
- Storage only via the guarded storage libs (`client/src/lib/recipe-history-storage.ts`, `ratio-presets-storage.ts`, hook-level guards in `use-counter.ts`).
- **Bundle budget: 340 KB raw** on `dist/assets/index-*.js` (`.size-limit.json`, CI gate) with only ~12 KB headroom today — **every item below states its size impact, and every PR must show `pnpm size` passing.**

## A. Shared features (parity targets — IDs F1–F4 match the sibling repos' features-v2 docs)

### F1. Recipe JSON import — `static-ok` (size impact: ~1–2 KB, no new deps)

Source: this repo already exports JSON (`client/src/components/actions-panel.tsx`); import is the missing half. Validation style to reuse: the shape guards in `client/src/lib/recipe-history-storage.ts` / `ratio-presets-storage.ts`.
Behavior: "Import recipe" file input (`accept="application/json"`) in the actions panel → parse → validate against the shared schema below → load amounts (switching to custom mode if proportions differ from original) . Invalid file → translated inline error, no state change.

Shared JSON schema (identical in all three repos — an export from any sibling must import here):

```json
{
  "app": "gazpachator",
  "version": 1,
  "amounts": { "<ingredientId>": 1000 },
  "proportions": { "<ingredientId>": 25 }
}
```

- `amounts` values are grams (finite numbers > 0); `proportions` values are percent-of-tomato and the field is optional/nullable.
- Canonical ingredient ids: `tomato`, `cucumber`, `greenPepper`, `garlic`, `oliveOil`, `salt`, `vinegar`. **This repo uses `jerezVinegar` internally — map `jerezVinegar` ↔ `vinegar` at the import/export boundary**, and update the existing JSON export in `actions-panel.tsx` to emit canonical ids + the schema envelope above so bolt/v0 can import it.
- Unknown `app`/`version` or unknown ids → reject gracefully. No free-text fields are required for import.

Tests: unit round-trip (export → import restores identical state, including the vinegar mapping) + malformed-input table; e2e export-then-import flow.

### F2. Serving-size selector — `static-ok` (size impact: ~1 KB, no new deps)

Source: roadmap item in `docs/features.md` ("serving size selector"); inverse of the existing estimate `estimateServings()` in `client/src/lib/recipe-calculator.ts` (`Math.ceil(volume * 4)` ⇒ 250 ml per serving; density 1.05 kg/L in `calculateVolume()`).
Behavior: numeric input "servings" (integer, min 1) next to the servings display → target volume = N × 0.25 L → derive the tomato base from the volume model → run the normal proportional recalculation (original mode). Pin **250 ml/serving as a named exported constant** in `recipe-calculator.ts` and use it in both directions (estimate and selector) so the round trip is stable; note that `Math.ceil` display rounding means selector → estimate may display N but never N−1. All labels in 4 languages. Tick the roadmap box in `docs/features.md` when it lands.
Tests: unit for the inverse function (round-trip property: setServings(n) ⇒ estimateServings ≥ n); e2e set-servings → all ingredient amounts change proportionally.

### F3. Recipe image (PNG) export — `static-ok` (size impact: ~2–4 KB, zero new deps — plain Canvas API; if `pnpm size` is tight, land B1 first)

Source of truth: `gazpachator-bolt/src/components/ExportShare.tsx` (canvas drawing starts ~L116; `toBlob` → download; `navigator.canShare({ files })` → Web Share of the image).
Behavior: add "Download PNG" (and Web Share of the image where supported) to the actions panel: render title + scaled ingredient list + volume onto an offscreen `<canvas>` with a fixed palette (canvas output is theme-independent; parchment-tinted palette welcome — that's visual, this repo's call). All strings via `t()`; `data-testid` on the new buttons.
Tests: extract the text-layout helper as a pure function and unit-test it; e2e assert the download (Playwright `download` event).

### F4. Shareable recipe URLs (`?r=`) — `static-ok` (size impact: ~1–2 KB, no new deps)

Origin: this repo's roadmap (`docs/features.md`, "URL-encoded recipe state"); new to all three repos. Tick the roadmap box when it lands.
Encoding spec (identical in all three repos):

- URL param `r` = base64url of `JSON.stringify({ "v": 1, "a": { "<ingredientId>": grams }, "p": { "<ingredientId>": percent } | null })`.
- Numbers and canonical ingredient ids only (same id list as F1 — **encode `vinegar`, map to `jerezVinegar` internally**) — **no free text** (no preset/recipe names), so there is no XSS surface. Typical length 60–120 chars.

Behavior:

- On app load, if `?r=` is present and decodes + validates → load that recipe, **winning over persisted localStorage state**, then `history.replaceState` to strip the param (avoid re-applying on reload).
- Build share URLs from `location.origin + location.pathname` — never hardcode the base path (`/GazpachoScaler/`).
- Upgrade the existing "Copy link" button in `actions-panel.tsx` to include `?r=`; Web Share (social + text) shares the encoded URL.
- Validate every decoded number (finite, > 0) and every id; unknown `v` or any invalid field → ignore the param entirely and fall back to normal startup.

Tests: unit codec round-trip + malformed-input table (truncated base64, wrong types, unknown ids, negative numbers); e2e open URL with `?r=` → exact amounts rendered → param stripped; copy-link now contains `?r=`.

## B. Repo-specific quick wins & hygiene

### B1. Prune round 2 — `static-ok` (size impact: **negative** — this is the budget-headroom maker; do it first)

- Delete unused shadcn files `client/src/components/ui/{dialog,label,separator,sheet,skeleton,toggle}.tsx` and drop the deps they keep alive: `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-separator`, `@radix-ui/react-toggle` (sheet reuses dialog). Used UI stays: button, card, input, dropdown-menu, toast, toaster, tooltip.
- Remove unused translation keys from all 4 language blocks in `client/src/lib/translations.ts`: `reset_success`, `save`, `cancel`, `favorites`, `base`.
- Remove unused Tailwind tokens in `tailwind.config.ts` (`chart.1–5`, `sidebar.*`) and the `@tailwindcss/typography` plugin (no `prose` usage) — Replit scaffold leftovers.

### B2. Language context — `static-ok` (size impact: ~0)

Language state is duplicated: `client/src/components/language-selector.tsx` keeps its own `currentLanguage` (and reads localStorage on mount) while `client/src/pages/home.tsx` keeps a separate one that actually drives `t()`, synced only via callback. Introduce a `LanguageContext` (pattern: `client/src/components/theme-provider.tsx`) owning state + persistence; both consumers read from it.

### B3. a11y + dead markup — `static-ok` (size impact: ~0)

- `client/src/components/recipe-calculator.tsx`: ingredient number inputs are not programmatically associated with their visible labels — add `htmlFor`/`id` (or `aria-label`) per input.
- Remove the dead Font Awesome `<i className="fas fa-...">` markup (no FA stylesheet is loaded; icons render nothing).

### B4. Stale docs refresh — `static-ok` (size impact: none)

- `docs/architecture.md`: still lists Wouter, TanStack Query, Vite 5, `server/`, `shared/schema.ts`, `not-found.tsx`, `queryClient.ts`, `use-mobile.tsx` — all removed in the prune (#10). Rewrite to the current reality (Vite 8, no router, no server).
- `README.md`: tech-stack line still says TanStack Query · Wouter and Node 20 — update to Node 22 / Vite 8 / actual deps.

## C. Test gap-fill

### C1. e2e: uncovered flows — `static-ok`

- Reset-to-original button.
- Mode switch hides/shows the ratio-presets panel (custom-only render in `client/src/pages/home.tsx`).
- Copy-link button (asserting clipboard content — extends naturally into F4's `?r=` assertion).
- Share-social path (only share-text is covered in `e2e/share.spec.ts`).

## D. Recorded, deferred (do not implement in this round)

- `needs-backend` — global counter via Supabase (full ready-to-execute plan in `docs/future-supabase-migration.md`); cross-device preset sync (same doc).
- `chore-migration` — blocked dependabot majors: React 19 (#19, +50 KB over the 340 KB budget — needs B1 headroom and/or a budget decision), TypeScript 6 (#23, `baseUrl` removal breaks the `@/*` alias — migrate `tsconfig.json` paths), Tailwind 4 (#24, PostCSS pipeline migration to `@tailwindcss/postcss` + CSS-first config).
- Considered & rejected for v2: metric/imperial unit toggle — gram-native Spanish recipe, low value vs rounding drift + translation and bundle cost. Revisit only on user demand.

## Verification

Per item: `pnpm lint && pnpm check && pnpm format:check && pnpm test:coverage && pnpm build && pnpm test:e2e && pnpm size` (build must stay under the 340 KB raw budget). For F1/F4: manually verify a URL/JSON produced here loads in the sibling repos (canonical ids — vinegar mapping).

## Suggested skills

- `/tdd` for F1 schema validation + vinegar mapping, F2 inverse function, F4 codec
- `/simplify` after the B1 prune
- `/code-review` before opening each PR
- `/security-review` for F4 (URL input handling)
