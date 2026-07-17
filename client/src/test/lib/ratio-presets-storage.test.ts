import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readRatioPresets, writeRatioPresets, type RatioPreset } from '@/lib/ratio-presets-storage';

const RATIO_PRESETS_KEY = 'gazpacho-ratio-presets';

const samplePreset: RatioPreset = {
  id: 'abc',
  name: 'Extra garlicky',
  proportions: {
    tomato: 1000,
    cucumber: 333.33,
    greenPepper: 166.67,
    garlic: 40,
    oliveOil: 15,
    salt: 6,
    jerezVinegar: 18,
  },
};

describe('ratio-presets-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns an empty array when nothing is stored', () => {
    expect(readRatioPresets()).toEqual([]);
  });

  it('round-trips a written preset list', () => {
    writeRatioPresets([samplePreset]);
    expect(readRatioPresets()).toEqual([samplePreset]);
  });

  it('falls back to [] and warns on corrupt JSON', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(RATIO_PRESETS_KEY, 'not-json');
    expect(readRatioPresets()).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
  });

  it('falls back to [] and warns when payload is not an array', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(RATIO_PRESETS_KEY, JSON.stringify({ id: 'x' }));
    expect(readRatioPresets()).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
  });

  it('falls back to [] and warns when an entry is the wrong shape', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(RATIO_PRESETS_KEY, JSON.stringify([{ id: 'x', name: 'no proportions' }]));
    expect(readRatioPresets()).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
  });

  it('rejects entries missing an ingredient key', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const broken = {
      ...samplePreset,
      proportions: { ...samplePreset.proportions, salt: undefined },
    };
    localStorage.setItem(RATIO_PRESETS_KEY, JSON.stringify([broken]));
    expect(readRatioPresets()).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
  });

  it('rejects entries with a non-numeric ingredient amount', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const broken = {
      ...samplePreset,
      proportions: { ...samplePreset.proportions, salt: 'lots' },
    };
    localStorage.setItem(RATIO_PRESETS_KEY, JSON.stringify([broken]));
    expect(readRatioPresets()).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
  });
});
