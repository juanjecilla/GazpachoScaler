import { test, expect } from '@playwright/test';

test.describe('Named ratio presets (custom mode)', () => {
  test('save → reload persists → load restores → delete; built-in present & undeletable', async ({
    page,
  }) => {
    await page.goto('./');

    // Presets live in custom mode only.
    await expect(page.getByTestId('ratio-presets-panel')).toHaveCount(0);
    await page.getByTestId('custom-recipe-button').click();
    await expect(page.getByTestId('ratio-presets-panel')).toBeVisible();

    // The built-in default preset is always present and cannot be deleted.
    const builtIn = page.locator('[data-testid="ratio-preset-item"][data-builtin="true"]');
    await expect(builtIn).toHaveCount(1);
    await expect(builtIn.getByTestId('delete-preset-button')).toHaveCount(0);

    // Adjust a custom proportion to a distinctive value, then save it as a preset.
    await page.getByTestId('input-garlic').fill('40');
    await page.getByTestId('save-preset-name-input').fill('Extra garlicky');
    await page.getByTestId('save-preset-button').click();

    const userPreset = page.locator('[data-testid="ratio-preset-item"][data-builtin="false"]');
    await expect(userPreset).toHaveCount(1);
    await expect(userPreset.getByTestId('ratio-preset-name')).toHaveText('Extra garlicky');

    // Reload — the preset must survive (persisted in localStorage). Mode resets
    // to original in memory, so re-enter custom mode to see the panel again.
    await page.reload();
    await page.getByTestId('custom-recipe-button').click();
    await expect(page.getByTestId('ratio-presets-panel')).toBeVisible();
    await expect(userPreset).toHaveCount(1);
    await expect(userPreset.getByTestId('ratio-preset-name')).toHaveText('Extra garlicky');

    // Change the garlic amount, then load the preset to restore it.
    await page.getByTestId('input-garlic').fill('99');
    await userPreset.getByTestId('load-preset-button').click();
    const restored = await page.getByTestId('input-garlic').inputValue();
    expect(parseFloat(restored)).toBeCloseTo(40, 1);

    // Delete the user preset — it is gone; the built-in remains.
    await userPreset.getByTestId('delete-preset-button').click();
    await expect(userPreset).toHaveCount(0);
    await expect(builtIn).toHaveCount(1);
  });
});
