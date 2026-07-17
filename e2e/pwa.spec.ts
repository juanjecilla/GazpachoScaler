import { test, expect } from '@playwright/test';

/**
 * Service worker registration and offline caching only exist in the
 * production build served by `pnpm preview` (CI/preview mode). The local
 * dev server (`pnpm dev`) never registers a SW, so those assertions are
 * skipped gracefully outside CI rather than failing.
 */
const isCI = !!process.env.GITHUB_ACTIONS;

test.describe('PWA', () => {
  test('exposes a web app manifest link', async ({ page }) => {
    await page.goto('./');

    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', /manifest\.webmanifest$/);
  });

  test('registers an active service worker in the production build', async ({ page }) => {
    test.skip(!isCI, 'Service worker is only built for the production/preview server');

    await page.goto('./');

    const hasActiveServiceWorker = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const registration = await navigator.serviceWorker.ready;
      return !!registration.active;
    });
    expect(hasActiveServiceWorker).toBe(true);
  });

  test('serves the app shell offline once the SW has cached it', async ({ page, context }) => {
    test.skip(!isCI, 'Offline caching only applies to the production/preview build');

    await page.goto('./');
    await page.evaluate(() => navigator.serviceWorker.ready);
    // Reload so this navigation is controlled by the now-active service worker.
    await page.reload();

    await context.setOffline(true);
    await page.reload();

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await context.setOffline(false);
  });
});
