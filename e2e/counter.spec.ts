import { test, expect } from '@playwright/test';

test.describe('Community counter', () => {
  test('increments once and persists across reload (localStorage)', async ({ page }) => {
    await page.goto('./');

    const counter = page.getByTestId('made-counter');
    await expect(counter).toHaveText('2,847');

    const madeItButton = page.getByTestId('made-it-button');
    await madeItButton.click();

    await expect(counter).toHaveText('2,848');
    await expect(madeItButton).toBeDisabled();

    // Value and "already made" state survive a reload.
    await page.reload();
    await expect(page.getByTestId('made-counter')).toHaveText('2,848');
    await expect(page.getByTestId('made-it-button')).toBeDisabled();
  });
});
