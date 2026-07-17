import { describe, it, expect, beforeEach } from 'vitest';
import { RecipeCalculator, ORIGINAL_PROPORTIONS, estimateServings } from '@/lib/recipe-calculator';

describe('RecipeCalculator', () => {
  let calc: RecipeCalculator;

  beforeEach(() => {
    calc = new RecipeCalculator();
  });

  it('initializes with ORIGINAL_PROPORTIONS', () => {
    expect(calc.getProportions()).toEqual(ORIGINAL_PROPORTIONS);
  });

  it('defaults to original mode', () => {
    expect(calc.getMode()).toBe('original');
  });

  describe('updateIngredient — original mode', () => {
    it('scales all ingredients proportionally when tomato changes', () => {
      const result = calc.updateIngredient('tomato', 2000);
      expect(result.tomato).toBe(2000);
      expect(result.cucumber).toBeCloseTo(666.66, 1);
      expect(result.greenPepper).toBeCloseTo(333.34, 1);
    });

    it('ratio for doubled tomato equals 2 for all ingredients', () => {
      const result = calc.updateIngredient('tomato', 2000);
      Object.keys(ORIGINAL_PROPORTIONS).forEach((key) => {
        expect(result[key]).toBeCloseTo(ORIGINAL_PROPORTIONS[key] * 2, 1);
      });
    });
  });

  describe('updateIngredient — custom mode', () => {
    beforeEach(() => {
      calc.setMode('custom');
    });

    it('only changes the target ingredient', () => {
      const result = calc.updateIngredient('cucumber', 500);
      expect(result.cucumber).toBe(500);
      expect(result.tomato).toBe(ORIGINAL_PROPORTIONS.tomato);
      expect(result.greenPepper).toBe(ORIGINAL_PROPORTIONS.greenPepper);
    });
  });

  describe('resetToOriginal', () => {
    it('restores exact ORIGINAL_PROPORTIONS after changes', () => {
      calc.updateIngredient('tomato', 3000);
      const result = calc.resetToOriginal();
      expect(result).toEqual(ORIGINAL_PROPORTIONS);
    });
  });

  describe('setProportions', () => {
    it('replaces every proportion with the given snapshot', () => {
      const snapshot = {
        tomato: 2000,
        cucumber: 666.66,
        greenPepper: 333.34,
        garlic: 24,
        oliveOil: 30,
        salt: 12,
        jerezVinegar: 36,
      };
      const result = calc.setProportions(snapshot);
      expect(result).toEqual(snapshot);
      expect(calc.getProportions()).toEqual(snapshot);
    });

    it('returns a copy, not the caller reference', () => {
      const snapshot = { ...ORIGINAL_PROPORTIONS, tomato: 5000 };
      const result = calc.setProportions(snapshot);
      result.tomato = 9999;
      expect(calc.getProportions().tomato).toBe(5000);
    });
  });

  describe('calculateVolume', () => {
    it('returns ~1.47L for the default recipe', () => {
      expect(calc.calculateVolume()).toBeCloseTo(1.47, 1);
    });

    it('doubles when all ingredients are doubled', () => {
      const original = calc.calculateVolume();
      calc.updateIngredient('tomato', 2000);
      expect(calc.calculateVolume()).toBeCloseTo(original * 2, 1);
    });
  });

  describe('getProportionLabel', () => {
    it('returns "Base" for tomato', () => {
      expect(calc.getProportionLabel('tomato')).toBe('Base');
    });

    it('returns fraction or percentage for cucumber', () => {
      const label = calc.getProportionLabel('cucumber');
      // Stored as 333.33 (rounded), so proportion ≈ 0.33333, may not exactly equal 1/3
      expect(label).toMatch(/1\/3|33\.3%/);
    });

    it('returns fraction or percentage for greenPepper', () => {
      const label = calc.getProportionLabel('greenPepper');
      expect(label).toMatch(/1\/6|16\.7%/);
    });

    it('returns percentage for garlic', () => {
      expect(calc.getProportionLabel('garlic')).toBe('1.2%');
    });
  });

  describe('exportRecipe', () => {
    it('returns correct shape', () => {
      const exported = calc.exportRecipe();
      expect(exported).toHaveProperty('title');
      expect(exported).toHaveProperty('ingredients');
      expect(exported).toHaveProperty('volume');
      expect(exported).toHaveProperty('mode');
      expect(exported).toHaveProperty('exportDate');
    });

    it('volume string ends with L', () => {
      expect(calc.exportRecipe().volume).toMatch(/L$/);
    });

    it('mode matches current mode', () => {
      calc.setMode('custom');
      expect(calc.exportRecipe().mode).toBe('custom');
    });
  });

  describe('estimateServings', () => {
    it('rounds up a fraction just over a serving boundary (1.01L -> 5)', () => {
      expect(estimateServings(1.01)).toBe(5);
    });

    it('returns an exact multiple with no rounding (1.5L -> 6)', () => {
      expect(estimateServings(1.5)).toBe(6);
    });

    it('returns 0 for 0L', () => {
      expect(estimateServings(0)).toBe(0);
    });

    it('matches the default recipe volume (~1.47L -> 6)', () => {
      expect(estimateServings(calc.calculateVolume())).toBe(6);
    });
  });
});
