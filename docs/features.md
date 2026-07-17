# Features

## Recipe calculator

The core feature. Enter any ingredient weight and GazpachoScaler recalculates the rest.

### Original mode (default)

Change one ingredient → all others scale proportionally based on traditional ratios.

Base recipe (1 serving ~1.5L):

| Ingredient    | Amount | Ratio |
| ------------- | ------ | ----- |
| Tomato        | 1000g  | Base  |
| Cucumber      | 333g   | 1/3   |
| Green pepper  | 167g   | 1/6   |
| Garlic        | 12g    | 1.2%  |
| Olive oil     | 15g    | 1.5%  |
| Salt          | 6g     | 0.6%  |
| Jerez vinegar | 18g    | 1.8%  |

### Custom mode

Each ingredient is adjusted independently. Use when you want to tweak the recipe without affecting others.

### Volume estimator

Displays estimated yield in litres: `totalWeight / 1000 / 1.05` (gazpacho density ≈ 1.05 kg/L).

### Reset

Restores all ingredients to the original 1kg-tomato proportions.

## Multilingual support

4 languages selectable from the globe dropdown in the top-right corner:

- 🇬🇧 English
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

Language preference is saved to `localStorage` and restored on next visit.

## Theme

Light / Dark / System (follows OS preference). Toggle via the sun/moon button in the top-right corner. Preference saved to `localStorage`.

## Community counter

A running count of people who have made the recipe. Backed by `localStorage` — personal to each device. Click **I Made It** once to add yourself; the button disables after one click per device.

See [future-supabase-migration.md](future-supabase-migration.md) for upgrading to a shared global counter.

## Export & share

- **Export JSON** — downloads a `.json` file with all ingredient amounts, volume, mode, and timestamp
- **Copy link** — copies the current page URL to clipboard
- **Share** — uses the Web Share API on supported devices (mobile); falls back to a toast notification on desktop

## Roadmap

- [ ] URL-encoded recipe state (`?r=...`) so shared links open with the exact recipe
- [ ] Serving size selector (multiply all ingredients by N servings)
- [ ] Print-friendly recipe card (`window.print()` + `@media print` CSS)
- [ ] Open Graph meta tags for social sharing previews
- [ ] Global community counter via Supabase (see migration guide)
