import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipeHistory, type SaveRecipeInput } from '@/hooks/use-recipe-history';
import type { IngredientKey } from '@/lib/recipe-calculator';

const baseIngredients: Record<IngredientKey, number> = {
  tomato: 1000,
  cucumber: 333.33,
  greenPepper: 166.67,
  garlic: 12,
  oliveOil: 15,
  salt: 6,
  jerezVinegar: 18,
};

const input = (name: string, extra?: Partial<SaveRecipeInput>): SaveRecipeInput => ({
  name,
  mode: 'original',
  ingredients: baseIngredients,
  ...extra,
});

describe('useRecipeHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts empty when nothing is persisted', () => {
    const { result } = renderHook(() => useRecipeHistory());
    expect(result.current.savedRecipes).toEqual([]);
    expect(result.current.favoriteIds).toEqual([]);
  });

  it('saveRecipe adds a recipe with id, timestamp and current amounts', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let saved: ReturnType<typeof result.current.saveRecipe>;
    act(() => {
      saved = result.current.saveRecipe(input('Batch A'));
    });
    expect(result.current.savedRecipes).toHaveLength(1);
    expect(result.current.savedRecipes[0].name).toBe('Batch A');
    expect(result.current.savedRecipes[0].id).toBe(saved!.id);
    expect(result.current.savedRecipes[0].createdAt).toBeTruthy();
    expect(result.current.savedRecipes[0].ingredients.tomato).toBe(1000);
  });

  it('prepends the newest recipe', () => {
    const { result } = renderHook(() => useRecipeHistory());
    act(() => {
      result.current.saveRecipe(input('Old'));
    });
    act(() => {
      result.current.saveRecipe(input('New'));
    });
    expect(result.current.savedRecipes.map((r) => r.name)).toEqual(['New', 'Old']);
  });

  it('persists across hook remounts (reload)', () => {
    const first = renderHook(() => useRecipeHistory());
    act(() => {
      first.result.current.saveRecipe(input('Persisted', { mode: 'custom' }));
    });
    const second = renderHook(() => useRecipeHistory());
    expect(second.result.current.savedRecipes).toHaveLength(1);
    expect(second.result.current.savedRecipes[0].name).toBe('Persisted');
    expect(second.result.current.savedRecipes[0].mode).toBe('custom');
  });

  it('deleteRecipe removes the recipe', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let id = '';
    act(() => {
      id = result.current.saveRecipe(input('Del')).id;
    });
    act(() => {
      result.current.deleteRecipe(id);
    });
    expect(result.current.savedRecipes).toHaveLength(0);
  });

  it('toggleFavorite marks then unmarks a recipe', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let id = '';
    act(() => {
      id = result.current.saveRecipe(input('Fav')).id;
    });
    act(() => {
      result.current.toggleFavorite(id);
    });
    expect(result.current.isFavorite(id)).toBe(true);
    act(() => {
      result.current.toggleFavorite(id);
    });
    expect(result.current.isFavorite(id)).toBe(false);
  });

  it('deleteRecipe also drops the recipe from favorites', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let id = '';
    act(() => {
      id = result.current.saveRecipe(input('Both')).id;
    });
    act(() => {
      result.current.toggleFavorite(id);
    });
    act(() => {
      result.current.deleteRecipe(id);
    });
    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.savedRecipes).toEqual([]);
  });

  it('isFavorite is false for an unknown id', () => {
    const { result } = renderHook(() => useRecipeHistory());
    expect(result.current.isFavorite('nope')).toBe(false);
  });

  it('favorites persist across hook remounts', () => {
    const first = renderHook(() => useRecipeHistory());
    let id = '';
    act(() => {
      id = first.result.current.saveRecipe(input('KeepFav')).id;
    });
    act(() => {
      first.result.current.toggleFavorite(id);
    });
    const second = renderHook(() => useRecipeHistory());
    expect(second.result.current.isFavorite(id)).toBe(true);
  });
});
