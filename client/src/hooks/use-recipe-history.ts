import { useState, useCallback } from 'react';
import type { IngredientKey } from '@/lib/recipe-calculator';
import {
  readSavedRecipes,
  writeSavedRecipes,
  readFavoriteIds,
  writeFavoriteIds,
  type SavedRecipe,
} from '@/lib/recipe-history-storage';

export interface SaveRecipeInput {
  name: string;
  mode: 'original' | 'custom';
  ingredients: Record<IngredientKey, number>;
}

/**
 * Recipe history + favorites, persisted through the recipe-history storage
 * module (no direct localStorage access here). New recipes are prepended so the
 * most recent snapshot appears first. Deleting a recipe also drops it from
 * favorites so no orphan favorite id survives.
 */
export function useRecipeHistory() {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>(readSavedRecipes);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readFavoriteIds);

  const saveRecipe = useCallback((input: SaveRecipeInput): SavedRecipe => {
    const recipe: SavedRecipe = {
      id: crypto.randomUUID(),
      name: input.name,
      createdAt: new Date().toISOString(),
      mode: input.mode,
      ingredients: { ...input.ingredients },
    };
    setSavedRecipes((prev) => {
      const next = [recipe, ...prev];
      writeSavedRecipes(next);
      return next;
    });
    return recipe;
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setSavedRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      writeSavedRecipes(next);
      return next;
    });
    setFavoriteIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = prev.filter((fid) => fid !== id);
      writeFavoriteIds(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id];
      writeFavoriteIds(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  return {
    savedRecipes,
    favoriteIds,
    saveRecipe,
    deleteRecipe,
    toggleFavorite,
    isFavorite,
  };
}
