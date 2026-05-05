# Juanje's Golden Gazpacho

A recipe calculator for traditional Andalusian gazpacho. Scale ingredients proportionally or adjust them independently, export your recipe, and share it with friends.

**Live:** https://juanjecilla.github.io/GazpachoScaler/

## Features

- **Original mode** — change one ingredient and all others scale proportionally
- **Custom mode** — adjust any ingredient independently
- **4 languages** — English, Spanish, French, German
- **Dark/light theme** with system preference detection
- **Export** recipe as JSON, copy link, or share via Web Share API
- **Community counter** — track how many people have made the recipe

## Quick start

```bash
node -v   # requires Node 20+
npm ci
npm run dev   # → http://localhost:5173
```

## Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Vite dev server                     |
| `npm run build`         | TypeScript check + production build |
| `npm run preview`       | Preview production build            |
| `npm run lint`          | ESLint (0 warnings)                 |
| `npm run format`        | Prettier format all files           |
| `npm run test`          | Vitest test suite                   |
| `npm run test:coverage` | Coverage report                     |

## Tech stack

React 18 · TypeScript · Vite · Shadcn/ui · Tailwind CSS · TanStack Query · Wouter

## Docs

- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Contributing](docs/contributing.md)
- [Features](docs/features.md)
- [Future: Supabase counter migration](docs/future-supabase-migration.md)
