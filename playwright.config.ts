import { defineConfig, devices } from '@playwright/test';

/**
 * In CI (GITHUB_ACTIONS) we build and serve the production bundle with
 * `pnpm preview` so the `/GazpachoScaler/` GitHub Pages base path is exercised
 * end to end. Locally we run the Vite dev server at the root path for speed.
 */
const isCI = !!process.env.GITHUB_ACTIONS;

const baseURL = isCI ? 'http://localhost:4173/GazpachoScaler/' : 'http://localhost:5173/';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    locale: 'en-US',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: isCI ? 'pnpm preview --port 4173 --strictPort' : 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
