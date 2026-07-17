import { INGREDIENTS, type IngredientKey } from '@/lib/recipe-calculator';

/**
 * A persisted snapshot of the calculator: the exact ingredient amounts, the
 * mode they were captured in, plus a name and timestamp. Restoring a snapshot
 * reloads these amounts verbatim.
 */
export interface SavedRecipe {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
  mode: 'original' | 'custom';
  ingredients: Record<IngredientKey, number>;
}

const SAVED_RECIPES_KEY = 'gazpacho-saved-recipes';
const FAVORITE_IDS_KEY = 'gazpacho-favorite-ids';

const INGREDIENT_KEYS: IngredientKey[] = INGREDIENTS.map((i) => i.key);

function isIngredientRecord(value: unknown): value is Record<IngredientKey, number> {
  if (typeof value !== 'object' || value === null) return false;
  const rec = value as Record<string, unknown>;
  return INGREDIENT_KEYS.every((key) => {
    const amount = rec[key];
    return typeof amount === 'number' && Number.isFinite(amount);
  });
}

function isSavedRecipe(value: unknown): value is SavedRecipe {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.name === 'string' &&
    typeof r.createdAt === 'string' &&
    (r.mode === 'original' || r.mode === 'custom') &&
    isIngredientRecord(r.ingredients)
  );
}

/**
 * Read the persisted recipe list, guarding against corrupt or wrong-shape data.
 * localStorage is user-writable and survives across app versions, so the stored
 * value can be missing, non-JSON, or an array of malformed entries. Anything
 * that is not a well-formed `SavedRecipe[]` falls back to an empty list rather
 * than propagating bad data into the UI.
 */
export function readSavedRecipes(): SavedRecipe[] {
  const raw = localStorage.getItem(SAVED_RECIPES_KEY);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isSavedRecipe)) return parsed;
    console.warn('recipe-history: invalid saved-recipes payload; falling back to []');
    return [];
  } catch {
    console.warn('recipe-history: corrupt saved-recipes JSON; falling back to []');
    return [];
  }
}

export function writeSavedRecipes(recipes: SavedRecipe[]): void {
  localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(recipes));
}

/**
 * Read the persisted favorite ids, guarding against corrupt or wrong-shape
 * data the same way as {@link readSavedRecipes}.
 */
export function readFavoriteIds(): string[] {
  const raw = localStorage.getItem(FAVORITE_IDS_KEY);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) return parsed;
    console.warn('recipe-history: invalid favorite-ids payload; falling back to []');
    return [];
  } catch {
    console.warn('recipe-history: corrupt favorite-ids JSON; falling back to []');
    return [];
  }
}

export function writeFavoriteIds(ids: string[]): void {
  localStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify(ids));
}
