import { test, expect } from '@playwright/test';

test.describe('Recipe history & favorites', () => {
  test('save → reload persists → load restores amounts → favorite → delete', async ({ page }) => {
    await page.goto('./');

    // Scale the recipe to a distinctive amount so the snapshot is identifiable.
    await page.getByTestId('input-tomato').fill('3000');

    // Save the current recipe under a name.
    await page.getByTestId('save-recipe-name-input').fill('Fiesta batch');
    await page.getByTestId('save-recipe-button').click();

    const item = page.getByTestId('saved-recipe-item');
    await expect(item).toBeVisible();
    await expect(page.getByTestId('saved-recipe-name')).toHaveText('Fiesta batch');

    // Reload the page — the recipe must survive (persisted in localStorage).
    await page.reload();
    await expect(page.getByTestId('saved-recipe-item')).toBeVisible();
    await expect(page.getByTestId('saved-recipe-name')).toHaveText('Fiesta batch');

    // Change the current amounts, then load the saved recipe to restore them.
    await page.getByTestId('input-tomato').fill('5000');
    await page.getByTestId('load-recipe-button').click();
    const restored = await page.getByTestId('input-tomato').inputValue();
    expect(parseFloat(restored)).toBeCloseTo(3000, 1);

    // Toggle favorite on.
    const favButton = page.getByTestId('favorite-recipe-button');
    await expect(favButton).toHaveAttribute('aria-pressed', 'false');
    await favButton.click();
    await expect(page.getByTestId('favorite-recipe-button')).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    // Delete the recipe — it is gone and the empty state returns.
    await page.getByTestId('delete-recipe-button').click();
    await expect(page.getByTestId('saved-recipe-item')).toHaveCount(0);
    await expect(page.getByTestId('no-saved-recipes')).toBeVisible();
  });
});
