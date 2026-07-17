import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipe } from '@/hooks/use-recipe';
import { ORIGINAL_PROPORTIONS } from '@/lib/recipe-calculator';

describe('useRecipe', () => {
  it('initializes with ORIGINAL_PROPORTIONS', () => {
    const { result } = renderHook(() => useRecipe());
    expect(result.current.ingredients).toEqual(ORIGINAL_PROPORTIONS);
  });

  it('initializes with original mode', () => {
    const { result } = renderHook(() => useRecipe());
    expect(result.current.mode).toBe('original');
  });

  it('initializes with non-zero volume', () => {
    const { result } = renderHook(() => useRecipe());
    expect(result.current.volume).toBeGreaterThan(0);
  });

  it('updateIngredient updates ingredients and volume', () => {
    const { result } = renderHook(() => useRecipe());
    act(() => {
      result.current.updateIngredient('tomato', 2000);
    });
    expect(result.current.ingredients.tomato).toBe(2000);
    expect(result.current.volume).toBeGreaterThan(1);
  });

  it('switchMode changes mode', () => {
    const { result } = renderHook(() => useRecipe());
    act(() => {
      result.current.switchMode('custom');
    });
    expect(result.current.mode).toBe('custom');
  });

  it('resetToOriginal restores ingredients', () => {
    const { result } = renderHook(() => useRecipe());
    act(() => {
      result.current.updateIngredient('tomato', 5000);
    });
    act(() => {
      result.current.resetToOriginal();
    });
    expect(result.current.ingredients).toEqual(ORIGINAL_PROPORTIONS);
  });

  it('loadRecipe restores exact amounts and mode', () => {
    const { result } = renderHook(() => useRecipe());
    const snapshot = {
      tomato: 2500,
      cucumber: 800,
      greenPepper: 400,
      garlic: 30,
      oliveOil: 40,
      salt: 15,
      jerezVinegar: 45,
    };
    act(() => {
      result.current.loadRecipe(snapshot, 'custom');
    });
    expect(result.current.ingredients).toEqual(snapshot);
    expect(result.current.mode).toBe('custom');
    expect(result.current.volume).toBeGreaterThan(0);
  });

  it('exportRecipe returns correct shape', () => {
    const { result } = renderHook(() => useRecipe());
    const exported = result.current.exportRecipe();
    expect(exported).toHaveProperty('title');
    expect(exported).toHaveProperty('ingredients');
    expect(exported).toHaveProperty('volume');
  });

  it('getProportionLabel returns Base for tomato', () => {
    const { result } = renderHook(() => useRecipe());
    expect(result.current.getProportionLabel('tomato')).toBe('Base');
  });
});
