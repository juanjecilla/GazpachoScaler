import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const repoName = 'GazpachoScaler';
const base = process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon-32.png'],
      // Injects the manifest <link> during `vite dev` too, so it can be
      // asserted in e2e without needing a production build. The service
      // worker itself is still only registered in production — see the
      // `import.meta.env.PROD` gate around <PwaUpdatePrompt> in home.tsx.
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'GazpachoScaler',
        short_name: 'GazpachoScaler',
        description: 'Scale Andalusian gazpacho ingredient proportions for any batch size',
        theme_color: '#dfa111',
        background_color: '#fcf8ee',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
    },
  },
  root: path.resolve(import.meta.dirname, 'client'),
  base,
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**'],
      exclude: [
        'src/components/ui/**',
        'src/components/theme-provider.tsx',
        'src/test/**',
        'src/hooks/use-toast.ts',
        'src/App.tsx',
        'src/main.tsx',
        'src/lib/translations.ts',
      ],
      thresholds: { lines: 80, branches: 75, functions: 80, statements: 80 },
    },
  },
});
