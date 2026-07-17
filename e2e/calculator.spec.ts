import { test, expect } from '@playwright/test';

test.describe('Recipe calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('page loads with the default recipe and 7 ingredients', async ({ page }) => {
    await expect(page).toHaveTitle(/Golden Gazpacho/);

    const inputs = page.locator('[data-testid^="input-"]');
    await expect(inputs).toHaveCount(7);

    // Default base ingredient (tomato) is 1000g.
    await expect(page.getByTestId('input-tomato')).toHaveValue('1000.00');
    await expect(page.getByTestId('volume-display')).toBeVisible();

    // Default volume (~1.47L) yields a servings estimate of 6.
    await expect(page.getByTestId('servings-display')).toBeVisible();
    await expect(page.getByTestId('servings-display')).toHaveText('6');
  });

  test('changing an ingredient rescales the rest proportionally (original mode)', async ({
    page,
  }) => {
    const cucumber = page.getByTestId('input-cucumber');
    await expect(cucumber).toHaveValue('333.33');

    // Doubling tomato (1000 -> 2000) should double every other ingredient.
    await page.getByTestId('input-tomato').fill('2000');

    await expect(cucumber).toHaveValue('666.66');
    await expect(page.getByTestId('input-greenPepper')).toHaveValue('333.34');
    await expect(page.getByTestId('input-garlic')).toHaveValue('24.00');

    // Volume doubles (~2.94L), so the servings estimate updates too (6 -> 12).
    await expect(page.getByTestId('servings-display')).toHaveText('12');
  });

  test('custom mode edits a single ingredient without rescaling the rest', async ({ page }) => {
    await page.getByTestId('custom-recipe-button').click();

    const cucumber = page.getByTestId('input-cucumber');
    await expect(cucumber).toHaveValue('333.33');

    // In custom mode, changing tomato must NOT rescale the other ingredients.
    await page.getByTestId('input-tomato').fill('2000');

    await expect(page.getByTestId('input-tomato')).toHaveValue('2000.00');
    await expect(cucumber).toHaveValue('333.33');
  });
});
