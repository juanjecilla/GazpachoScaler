import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const repoName = 'GazpachoScaler';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
    },
  },
  root: path.resolve(import.meta.dirname, 'client'),
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
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
        'src/components/actions-panel.tsx',
        'src/components/language-selector.tsx',
        'src/components/theme-provider.tsx',
        'src/test/**',
        'src/hooks/use-toast.ts',
        'src/hooks/use-mobile.tsx',
        'src/pages/**',
        'src/App.tsx',
        'src/main.tsx',
        'src/lib/queryClient.ts',
        'src/lib/translations.ts',
      ],
      thresholds: { lines: 70, functions: 70 },
    },
  },
});
