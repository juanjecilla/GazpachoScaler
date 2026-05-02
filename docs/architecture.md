# Architecture

## Overview

GazpachoScaler is a static single-page application deployed to GitHub Pages. There is no backend server — all state is managed in the browser.

```
Browser
  └── React SPA (Vite build → GitHub Pages)
        ├── Recipe state (in-memory, RecipeCalculator class)
        ├── Counter state (localStorage)
        ├── Theme (localStorage)
        └── Language (localStorage)
```

## Stack

| Layer             | Technology                          |
| ----------------- | ----------------------------------- |
| UI framework      | React 18 + TypeScript               |
| Build tool        | Vite 5                              |
| Component library | Shadcn/ui (Radix UI + Tailwind CSS) |
| Server state      | TanStack React Query                |
| Routing           | Wouter                              |
| Icons             | Lucide React                        |
| Testing           | Vitest + Testing Library            |

## State management

### Recipe state (`use-recipe.ts`)

Pure in-memory state via `RecipeCalculator` class. No persistence — resets on page reload by design (recipe is ephemeral input).

### Counter state (`use-counter.ts`)

`localStorage` keys:

- `gazpacho-counter` — integer count, initializes to `2847`
- `gazpacho-user-made` — `"true"` after the user clicks "I Made It" (prevents double-counting)

See [future-supabase-migration.md](future-supabase-migration.md) for upgrading to a global counter.

### Theme (`theme-provider.tsx`)

`localStorage` key: `gazpacho-theme` — values: `"light"` | `"dark"` | `"system"`

### Language (`language-selector.tsx`)

`localStorage` key: `gazpacho-language` — values: `"en"` | `"es"` | `"fr"` | `"de"`

## Directory structure

```
client/src/
  components/
    ui/              ← shadcn/ui generated components (do not edit manually)
    actions-panel.tsx       ← export, share, counter
    language-selector.tsx   ← i18n dropdown
    recipe-calculator.tsx   ← ingredient inputs + volume display
    recipe-mode-selector.tsx ← original vs custom toggle
    theme-provider.tsx      ← dark/light context
  hooks/
    use-counter.ts   ← localStorage counter read/write
    use-recipe.ts    ← RecipeCalculator state wrapper
    use-mobile.tsx   ← viewport detection
    use-toast.ts     ← shadcn toast state (generated)
  lib/
    recipe-calculator.ts ← pure calculation logic (no React)
    queryClient.ts       ← TanStack QueryClient config
    translations.ts      ← i18n strings (4 languages)
    utils.ts             ← cn() helper
  pages/
    home.tsx         ← main layout
    not-found.tsx    ← 404
  test/              ← Vitest tests mirroring src/ structure
shared/
  schema.ts          ← TypeScript type definitions (shared reference)
server/              ← archived Express backend (not used in production)
```

## Data flow

```
User types in ingredient input
  → RecipeCalculator.updateIngredient()
    → (original mode) recalculates all proportions proportionally
    → (custom mode) updates only that ingredient
  → useRecipe hook updates React state
  → RecipeCalculator.tsx re-renders with new values
```

## Environment variables

No environment variables required for the current localStorage-only build.

Future Supabase integration will require:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set in `.env.local` for development, GitHub Secrets for CI/CD.
