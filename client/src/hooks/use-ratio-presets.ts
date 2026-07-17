import { useState, useCallback, useMemo } from 'react';
import { ORIGINAL_PROPORTIONS, type IngredientKey } from '@/lib/recipe-calculator';
import { readRatioPresets, writeRatioPresets, type RatioPreset } from '@/lib/ratio-presets-storage';

/**
 * Stable id of the one built-in preset. It is synthesized on every render (never
 * persisted) so it always exists and can never be deleted.
 */
export const BUILT_IN_PRESET_ID = 'builtin-default';

export interface SavePresetInput {
  name: string;
  proportions: Record<IngredientKey, number>;
}

export interface UseRatioPresets {
  /** Built-in default preset followed by user presets, in insertion order. */
  presets: RatioPreset[];
  builtInPreset: RatioPreset;
  isBuiltIn: (id: string) => boolean;
  savePreset: (input: SavePresetInput) => RatioPreset;
  deletePreset: (id: string) => void;
}

/**
 * Named ratio presets for custom mode, persisted through the ratio-presets
 * storage module (no direct localStorage access here). A single built-in preset
 * carrying the original golden proportions always leads the list; it is
 * synthesized at runtime and can never be saved over or deleted.
 */
export function useRatioPresets(): UseRatioPresets {
  const [userPresets, setUserPresets] = useState<RatioPreset[]>(readRatioPresets);

  const builtInPreset = useMemo<RatioPreset>(
    () => ({
      id: BUILT_IN_PRESET_ID,
      // Display name is resolved via t('default_preset_name') in the UI; this
      // language-independent fallback is only stored on the synthesized object.
      name: "Juanje's Original",
      proportions: { ...ORIGINAL_PROPORTIONS } as Record<IngredientKey, number>,
    }),
    []
  );

  const presets = useMemo<RatioPreset[]>(
    () => [builtInPreset, ...userPresets],
    [builtInPreset, userPresets]
  );

  const isBuiltIn = useCallback((id: string) => id === BUILT_IN_PRESET_ID, []);

  const savePreset = useCallback((input: SavePresetInput): RatioPreset => {
    const preset: RatioPreset = {
      id: crypto.randomUUID(),
      name: input.name,
      proportions: { ...input.proportions },
    };
    setUserPresets((prev) => {
      const next = [...prev, preset];
      writeRatioPresets(next);
      return next;
    });
    return preset;
  }, []);

  const deletePreset = useCallback((id: string) => {
    // The built-in preset is not deletable.
    if (id === BUILT_IN_PRESET_ID) return;
    setUserPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeRatioPresets(next);
      return next;
    });
  }, []);

  return { presets, builtInPreset, isBuiltIn, savePreset, deletePreset };
}
