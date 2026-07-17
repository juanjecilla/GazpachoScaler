import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RatioPresetsPanel } from '@/components/ratio-presets-panel';
import { ORIGINAL_PROPORTIONS, type IngredientKey } from '@/lib/recipe-calculator';

const t = (key: string) => key;

const currentProportions: Record<IngredientKey, number> = {
  tomato: 1000,
  cucumber: 333.33,
  greenPepper: 166.67,
  garlic: 40,
  oliveOil: 15,
  salt: 6,
  jerezVinegar: 18,
};

function renderPanel(onLoad: (p: Record<IngredientKey, number>) => void = vi.fn()) {
  return render(
    <RatioPresetsPanel currentProportions={currentProportions} onLoad={onLoad} t={t} />
  );
}

async function savePreset(name: string) {
  await userEvent.type(screen.getByTestId('save-preset-name-input'), name);
  await userEvent.click(screen.getByTestId('save-preset-button'));
}

describe('RatioPresetsPanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('always shows the undeletable built-in default preset first', () => {
    renderPanel();
    const items = screen.getAllByTestId('ratio-preset-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveAttribute('data-builtin', 'true');
    expect(within(items[0]).getByTestId('ratio-preset-name')).toHaveTextContent(
      'default_preset_name'
    );
    // The built-in preset offers no delete control.
    expect(within(items[0]).queryByTestId('delete-preset-button')).not.toBeInTheDocument();
  });

  it('disables the save button until a name is entered', async () => {
    renderPanel();
    expect(screen.getByTestId('save-preset-button')).toBeDisabled();
    await userEvent.type(screen.getByTestId('save-preset-name-input'), 'Garlicky');
    expect(screen.getByTestId('save-preset-button')).not.toBeDisabled();
  });

  it('saves the current proportions as a named preset after the built-in', async () => {
    renderPanel();
    await savePreset('Garlicky');
    const items = screen.getAllByTestId('ratio-preset-item');
    expect(items).toHaveLength(2);
    expect(within(items[1]).getByTestId('ratio-preset-name')).toHaveTextContent('Garlicky');
    expect(items[1]).toHaveAttribute('data-builtin', 'false');
  });

  it('does not save when the name is only whitespace', async () => {
    renderPanel();
    await userEvent.type(screen.getByTestId('save-preset-name-input'), '   ');
    expect(screen.getByTestId('save-preset-button')).toBeDisabled();
    expect(screen.getAllByTestId('ratio-preset-item')).toHaveLength(1);
  });

  it('loads the built-in preset with the original proportions', async () => {
    const onLoad = vi.fn();
    renderPanel(onLoad);
    await userEvent.click(screen.getByTestId('load-preset-button'));
    expect(onLoad).toHaveBeenCalledOnce();
    expect(onLoad.mock.calls[0][0].garlic).toBe(ORIGINAL_PROPORTIONS.garlic);
  });

  it('loads a saved user preset with its stored proportions', async () => {
    const onLoad = vi.fn();
    renderPanel(onLoad);
    await savePreset('Garlicky');
    const loadButtons = screen.getAllByTestId('load-preset-button');
    // Index 0 is the built-in, index 1 is the saved preset.
    await userEvent.click(loadButtons[1]);
    expect(onLoad).toHaveBeenCalledOnce();
    expect(onLoad.mock.calls[0][0].garlic).toBe(40);
  });

  it('deletes a user preset, leaving the built-in in place', async () => {
    renderPanel();
    await savePreset('Deletable');
    expect(screen.getAllByTestId('ratio-preset-item')).toHaveLength(2);
    await userEvent.click(screen.getByTestId('delete-preset-button'));
    const items = screen.getAllByTestId('ratio-preset-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveAttribute('data-builtin', 'true');
  });

  it('persists saved presets across remounts', async () => {
    const { unmount } = renderPanel();
    await savePreset('Persisted');
    unmount();
    renderPanel();
    const items = screen.getAllByTestId('ratio-preset-item');
    expect(items).toHaveLength(2);
    expect(within(items[1]).getByTestId('ratio-preset-name')).toHaveTextContent('Persisted');
  });
});
