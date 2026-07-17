# Handoff: feature parity ports into GazpachoScaler

Goal: bring features from gazpachator-bolt and gazpachator-v0 into this repo. **Keep this repo's design (parchment/ancient scroll aesthetic) — port behavior, not markup.**

## Constraints

- Follow CLAUDE.md: `data-testid` on interactive elements, strings via `t()` in all 4 languages, storage through `client/src/hooks/use-counter.ts` pattern / a storage module (no direct `localStorage` in components), Conventional Commits, PR flow, coverage 80/75/80/80.

## Ports (in suggested order)

### 1. Recipe history + favorites (from gazpachator-bolt)

Source: `gazpachator-bolt/src/hooks/useRecipeHistory.ts` + tests, `RecipeHistoryPanel.tsx`, versioned storage in `StorageService.ts`.
Implement as a `use-recipe-history` hook + panel card matching the parchment style.

### 2. Named ratio presets (from gazpachator-v0)

Source: `gazpachator-v0/components/custom-ratio-modal.tsx` + reducer cases in `contexts/gazpacho-context.tsx`.
Scaler's `recipe-mode-selector` toggles original/custom — extend custom mode with named save/load/delete presets persisted in localStorage.

### 3. PWA (from gazpachator-bolt)

Source: bolt `vite.config.ts` VitePWA block + `PwaUpdatePrompt.tsx` + icons. Same Vite setup applies directly here (mind `base: /GazpachoScaler/`).

### 4. Servings estimate (from gazpachator-v0)

Source: `stats-panel.tsx` — `Math.ceil(totalVolume * 4)` servings; add near the volume display.

### 5. Text export / richer share (from gazpachator-bolt)

Scaler exports JSON only; bolt's `ExportShare.tsx` also offers human-readable text + Web Share API with file fallback. Add the text variant.

## Verification

`pnpm lint && pnpm format:check && pnpm check && pnpm test:coverage && pnpm build`, plus e2e specs once `handoff-e2e.md` is done.

## Suggested skills

- `/tdd` for history/preset logic
- `/code-review` before each PR
