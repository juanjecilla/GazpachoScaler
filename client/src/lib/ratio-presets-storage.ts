import { INGREDIENTS, type IngredientKey } from '@/lib/recipe-calculator';

/**
 * A named set of ingredient proportions the user can save and later load while
 * in custom mode. Only user-created presets are persisted here — the built-in
 * default preset is synthesized at runtime by {@link useRatioPresets} and never
 * written to storage.
 */
export interface RatioPreset {
  id: string;
  name: string;
  proportions: Record<IngredientKey, number>;
}

const RATIO_PRESETS_KEY = 'gazpacho-ratio-presets';

const INGREDIENT_KEYS: IngredientKey[] = INGREDIENTS.map((i) => i.key);

function isProportionsRecord(value: unknown): value is Record<IngredientKey, number> {
  if (typeof value !== 'object' || value === null) return false;
  const rec = value as Record<string, unknown>;
  return INGREDIENT_KEYS.every((key) => {
    const amount = rec[key];
    return typeof amount === 'number' && Number.isFinite(amount);
  });
}

function isRatioPreset(value: unknown): value is RatioPreset {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === 'string' && typeof p.name === 'string' && isProportionsRecord(p.proportions)
  );
}

/**
 * Read the persisted preset list, guarding against corrupt or wrong-shape data.
 * localStorage is user-writable and survives across app versions, so the stored
 * value can be missing, non-JSON, or an array of malformed entries. Anything
 * that is not a well-formed `RatioPreset[]` falls back to an empty list rather
 * than propagating bad data into the UI.
 */
export function readRatioPresets(): RatioPreset[] {
  const raw = localStorage.getItem(RATIO_PRESETS_KEY);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isRatioPreset)) return parsed;
    console.warn('ratio-presets: invalid presets payload; falling back to []');
    return [];
  } catch {
    console.warn('ratio-presets: corrupt presets JSON; falling back to []');
    return [];
  }
}

export function writeRatioPresets(presets: RatioPreset[]): void {
  localStorage.setItem(RATIO_PRESETS_KEY, JSON.stringify(presets));
}
