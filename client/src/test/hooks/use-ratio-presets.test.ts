import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRatioPresets, BUILT_IN_PRESET_ID } from '@/hooks/use-ratio-presets';
import { ORIGINAL_PROPORTIONS, type IngredientKey } from '@/lib/recipe-calculator';

const customProportions: Record<IngredientKey, number> = {
  tomato: 1000,
  cucumber: 333.33,
  greenPepper: 166.67,
  garlic: 40,
  oliveOil: 15,
  salt: 6,
  jerezVinegar: 18,
};

describe('useRatioPresets', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('always exposes the built-in preset first, with the original proportions', () => {
    const { result } = renderHook(() => useRatioPresets());
    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].id).toBe(BUILT_IN_PRESET_ID);
    expect(result.current.presets[0].proportions.tomato).toBe(ORIGINAL_PROPORTIONS.tomato);
    expect(result.current.isBuiltIn(BUILT_IN_PRESET_ID)).toBe(true);
  });

  it('savePreset appends a user preset after the built-in and returns it', () => {
    const { result } = renderHook(() => useRatioPresets());
    let saved: ReturnType<typeof result.current.savePreset>;
    act(() => {
      saved = result.current.savePreset({ name: 'Garlicky', proportions: customProportions });
    });
    expect(result.current.presets).toHaveLength(2);
    expect(result.current.presets[0].id).toBe(BUILT_IN_PRESET_ID);
    expect(result.current.presets[1].name).toBe('Garlicky');
    expect(result.current.presets[1].id).toBe(saved!.id);
    expect(result.current.presets[1].proportions.garlic).toBe(40);
    expect(result.current.isBuiltIn(saved!.id)).toBe(false);
  });

  it('persists user presets across hook remounts (reload)', () => {
    const first = renderHook(() => useRatioPresets());
    act(() => {
      first.result.current.savePreset({ name: 'Persisted', proportions: customProportions });
    });
    const second = renderHook(() => useRatioPresets());
    expect(second.result.current.presets).toHaveLength(2);
    expect(second.result.current.presets[1].name).toBe('Persisted');
  });

  it('does not persist the built-in preset', () => {
    renderHook(() => useRatioPresets());
    expect(localStorage.getItem('gazpacho-ratio-presets')).toBeNull();
  });

  it('deletePreset removes a user preset', () => {
    const { result } = renderHook(() => useRatioPresets());
    let id = '';
    act(() => {
      id = result.current.savePreset({ name: 'Del', proportions: customProportions }).id;
    });
    act(() => {
      result.current.deletePreset(id);
    });
    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].id).toBe(BUILT_IN_PRESET_ID);
  });

  it('deletePreset is a no-op for the built-in preset', () => {
    const { result } = renderHook(() => useRatioPresets());
    act(() => {
      result.current.deletePreset(BUILT_IN_PRESET_ID);
    });
    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].id).toBe(BUILT_IN_PRESET_ID);
  });
});
