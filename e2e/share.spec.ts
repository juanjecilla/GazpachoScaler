import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.describe('Share & export actions', () => {
  test('exports a JSON file containing the scaled amounts', async ({ page }) => {
    await page.goto('./');

    // Scale the recipe first so the export reflects non-default amounts.
    await page.getByTestId('input-tomato').fill('2000');

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-recipe-button').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('juanje-gazpacho-recipe.json');

    const path = await download.path();
    const recipe = JSON.parse(readFileSync(path, 'utf-8'));

    expect(recipe.ingredients.tomato).toBeCloseTo(2000, 5);
    expect(recipe.ingredients.cucumber).toBeCloseTo(666.66, 1);
    expect(recipe.volume).toMatch(/L$/);
  });

  test('exports a human-readable .txt file containing the scaled amounts', async ({ page }) => {
    await page.goto('./');

    // Scale the recipe first so the export reflects non-default amounts.
    await page.getByTestId('input-tomato').fill('2000');

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-text-button').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('juanje-gazpacho-recipe.txt');

    const path = await download.path();
    const content = readFileSync(path, 'utf-8');

    expect(content).toContain("Juanje's Golden Gazpacho Recipe");
    expect(content).toContain('Tomato: 2000 g');
    expect(content).toContain('Cucumber: 667 g');
    expect(content).toMatch(/Estimated Volume: \d+\.\d{2}L/);
    expect(content).toMatch(/Estimated Servings: \d+/);
  });

  test('sharing as text falls back to clipboard copy when the Web Share API is unavailable', async ({
    page,
  }) => {
    // Stub the clipboard and remove navigator.share before the app loads so
    // the button falls back to writing the recipe text to the clipboard.
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, 'share', { value: undefined, configurable: true });
      (window as unknown as { __clipboardText: string | null }).__clipboardText = null;
      Object.defineProperty(window.navigator, 'clipboard', {
        value: {
          writeText: (text: string) => {
            (window as unknown as { __clipboardText: string | null }).__clipboardText = text;
            return Promise.resolve();
          },
        },
        configurable: true,
      });
    });
    await page.goto('./');

    await page.getByTestId('input-tomato').fill('2000');
    await page.getByTestId('share-text-button').click();

    await expect(page.getByText('Recipe copied to clipboard!', { exact: true })).toBeVisible();

    const copied = await page.evaluate(
      () => (window as unknown as { __clipboardText: string | null }).__clipboardText
    );
    expect(copied).toContain('Tomato: 2000 g');
    expect(copied).toContain("Juanje's Golden Gazpacho Recipe");
  });

  test('print button triggers the browser print flow', async ({ page }) => {
    // Stub window.print before the app loads so we can assert it was called.
    await page.addInitScript(() => {
      (window as unknown as { __printCalled: boolean }).__printCalled = false;
      window.print = () => {
        (window as unknown as { __printCalled: boolean }).__printCalled = true;
      };
    });
    await page.goto('./');

    await page.getByTestId('print-recipe-button').click();

    const printed = await page.evaluate(
      () => (window as unknown as { __printCalled: boolean }).__printCalled
    );
    expect(printed).toBe(true);
  });
});
