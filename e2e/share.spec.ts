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
