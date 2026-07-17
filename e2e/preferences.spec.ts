import { test, expect } from '@playwright/test';

test.describe('Language selector', () => {
  test('switches language and persists the choice across reload', async ({ page }) => {
    await page.goto('./');

    // Default language is English.
    await expect(page.getByText('Ingredients Calculator')).toBeVisible();

    await page.getByTestId('language-selector-button').click();
    await page.getByTestId('language-option-es').click();

    // Text updates to Spanish.
    await expect(page.getByText('Calculadora de Ingredientes')).toBeVisible();
    await expect(page.getByText('Ingredients Calculator')).toHaveCount(0);

    // Choice persists across a reload.
    await page.reload();
    await expect(page.getByText('Calculadora de Ingredientes')).toBeVisible();
  });
});

test.describe('Theme toggle', () => {
  test('toggles between light and dark themes', async ({ page }) => {
    // Pin a deterministic starting theme so the assertions do not depend on
    // the CI runner's OS colour-scheme preference.
    await page.addInitScript(() => {
      window.localStorage.setItem('gazpacho-theme', 'light');
    });
    await page.goto('./');

    const html = page.locator('html');
    await expect(html).toHaveClass(/light/);

    await page.getByTestId('theme-toggle-button').click();
    await expect(html).toHaveClass(/dark/);

    await page.getByTestId('theme-toggle-button').click();
    await expect(html).toHaveClass(/light/);
    await expect(html).not.toHaveClass(/dark/);
  });
});
