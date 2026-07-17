import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  readSavedRecipes,
  writeSavedRecipes,
  readFavoriteIds,
  writeFavoriteIds,
  type SavedRecipe,
} from '@/lib/recipe-history-storage';

const SAVED_RECIPES_KEY = 'gazpacho-saved-recipes';
const FAVORITE_IDS_KEY = 'gazpacho-favorite-ids';

const sampleRecipe: SavedRecipe = {
  id: 'abc',
  name: 'Summer batch',
  createdAt: '2026-07-17T10:00:00.000Z',
  mode: 'original',
  ingredients: {
    tomato: 2000,
    cucumber: 666.66,
    greenPepper: 333.34,
    garlic: 24,
    oliveOil: 30,
    salt: 12,
    jerezVinegar: 36,
  },
};

describe('recipe-history-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('saved recipes', () => {
    it('returns an empty array when nothing is stored', () => {
      expect(readSavedRecipes()).toEqual([]);
    });

    it('round-trips a written recipe list', () => {
      writeSavedRecipes([sampleRecipe]);
      expect(readSavedRecipes()).toEqual([sampleRecipe]);
    });

    it('falls back to [] and warns on corrupt JSON', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(SAVED_RECIPES_KEY, 'not-json');
      expect(readSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });

    it('falls back to [] and warns when payload is not an array', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify({ id: 'x' }));
      expect(readSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });

    it('falls back to [] and warns when an entry is the wrong shape', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify([{ id: 'x', name: 'no fields' }]));
      expect(readSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });

    it('rejects entries missing an ingredient key', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const broken = {
        ...sampleRecipe,
        ingredients: { ...sampleRecipe.ingredients, salt: undefined },
      };
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify([broken]));
      expect(readSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });

    it('rejects entries with a non-numeric ingredient amount', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const broken = {
        ...sampleRecipe,
        ingredients: { ...sampleRecipe.ingredients, salt: 'lots' },
      };
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify([broken]));
      expect(readSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });

    it('rejects entries with an invalid mode', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify([{ ...sampleRecipe, mode: 'wild' }]));
      expect(readSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });
  });

  describe('favorite ids', () => {
    it('returns an empty array when nothing is stored', () => {
      expect(readFavoriteIds()).toEqual([]);
    });

    it('round-trips a written id list', () => {
      writeFavoriteIds(['a', 'b']);
      expect(readFavoriteIds()).toEqual(['a', 'b']);
    });

    it('falls back to [] and warns on corrupt JSON', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(FAVORITE_IDS_KEY, '{oops');
      expect(readFavoriteIds()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });

    it('falls back to [] and warns when an id is not a string', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify(['a', 42]));
      expect(readFavoriteIds()).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    });
  });
});
