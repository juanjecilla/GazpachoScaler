import { describe, it, expect } from 'vitest';
import { buildRecipeText, RECIPE_TITLE } from '@/lib/text-export';
import { translations } from '@/lib/translations';
import type { Language, TranslationKey } from '@/lib/translations';

function tFor(language: Language) {
  return (key: TranslationKey) => translations[language][key];
}

describe('buildRecipeText', () => {
  const ingredients = {
    tomato: 2000,
    cucumber: 666.66,
    greenPepper: 333.34,
    garlic: 24,
    oliveOil: 30,
    salt: 12,
    jerezVinegar: 36,
  };
  const volume = 2.94;

  it('includes the recipe title as a header', () => {
    const text = buildRecipeText({ ingredients, volume }, tFor('en'));
    expect(text.startsWith(RECIPE_TITLE)).toBe(true);
  });

  it('includes every ingredient with its localized name and rounded amount in grams', () => {
    const text = buildRecipeText({ ingredients, volume }, tFor('en'));

    expect(text).toContain('Tomato: 2000 g');
    expect(text).toContain('Cucumber: 667 g');
    expect(text).toContain('Green Pepper: 333 g');
    expect(text).toContain('Garlic: 24 g');
    expect(text).toContain('AOVE (Extra Virgin Olive Oil): 30 g');
    expect(text).toContain('Salt: 12 g');
    expect(text).toContain('Jerez Vinegar: 36 g');
  });

  it('includes the estimated volume and servings', () => {
    const text = buildRecipeText({ ingredients, volume }, tFor('en'));

    expect(text).toContain('Estimated Volume: 2.94L');
    expect(text).toContain('Estimated Servings: 12');
  });

  it('generates ingredient names, volume and servings labels in the current UI language', () => {
    const text = buildRecipeText({ ingredients, volume }, tFor('es'));

    expect(text).toContain('Tomate: 2000 g');
    expect(text).toContain('Pepino: 667 g');
    expect(text).toContain('Volumen Estimado: 2.94L');
    expect(text).toContain('Raciones Estimadas: 12');
  });

  it('defaults missing ingredient amounts to zero', () => {
    const text = buildRecipeText({ ingredients: { tomato: 1000 }, volume: 0.95 }, tFor('en'));

    expect(text).toContain('Cucumber: 0 g');
  });
});
