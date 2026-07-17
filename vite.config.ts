import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const repoName = 'GazpachoScaler';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
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
