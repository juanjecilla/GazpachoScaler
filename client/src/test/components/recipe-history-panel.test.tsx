import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeHistoryPanel } from '@/components/recipe-history-panel';
import type { SavedRecipe } from '@/lib/recipe-history-storage';

const t = (key: string) => key;

const currentIngredients = {
  tomato: 2000,
  cucumber: 666.66,
  greenPepper: 333.34,
  garlic: 24,
  oliveOil: 30,
  salt: 12,
  jerezVinegar: 36,
};

function renderPanel(onLoad: (recipe: SavedRecipe) => void = vi.fn()) {
  return render(
    <RecipeHistoryPanel
      currentMode="custom"
      currentIngredients={currentIngredients}
      onLoad={onLoad}
      t={t}
    />
  );
}

async function saveRecipe(name: string) {
  await userEvent.type(screen.getByTestId('save-recipe-name-input'), name);
  await userEvent.click(screen.getByTestId('save-recipe-button'));
}

describe('RecipeHistoryPanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('shows the empty state when no recipes are saved', () => {
    renderPanel();
    expect(screen.getByTestId('no-saved-recipes')).toBeInTheDocument();
  });

  it('disables the save button until a name is entered', async () => {
    renderPanel();
    expect(screen.getByTestId('save-recipe-button')).toBeDisabled();
    await userEvent.type(screen.getByTestId('save-recipe-name-input'), 'Batch');
    expect(screen.getByTestId('save-recipe-button')).not.toBeDisabled();
  });

  it('saves the current recipe and lists it', async () => {
    renderPanel();
    await saveRecipe('Summer batch');
    const item = screen.getByTestId('saved-recipe-item');
    expect(within(item).getByTestId('saved-recipe-name')).toHaveTextContent('Summer batch');
    // 2000g tomato snapshot is shown in the meta line.
    expect(item).toHaveTextContent('2000g');
    expect(screen.getByTestId('saved-recipes-count')).toHaveTextContent('1');
  });

  it('does not save when the name is only whitespace', async () => {
    renderPanel();
    await userEvent.type(screen.getByTestId('save-recipe-name-input'), '   ');
    // Button stays disabled, so nothing is saved.
    expect(screen.getByTestId('save-recipe-button')).toBeDisabled();
    expect(screen.getByTestId('no-saved-recipes')).toBeInTheDocument();
  });

  it('loads a recipe via the onLoad callback', async () => {
    const onLoad = vi.fn();
    renderPanel(onLoad);
    await saveRecipe('Loadable');
    await userEvent.click(screen.getByTestId('load-recipe-button'));
    expect(onLoad).toHaveBeenCalledOnce();
    expect(onLoad.mock.calls[0][0].name).toBe('Loadable');
    expect(onLoad.mock.calls[0][0].ingredients.tomato).toBe(2000);
    expect(onLoad.mock.calls[0][0].mode).toBe('custom');
  });

  it('toggles favorite state', async () => {
    renderPanel();
    await saveRecipe('Fav');
    const favButton = screen.getByTestId('favorite-recipe-button');
    expect(favButton).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(favButton);
    expect(screen.getByTestId('favorite-recipe-button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('deletes a recipe', async () => {
    renderPanel();
    await saveRecipe('Deletable');
    expect(screen.getByTestId('saved-recipe-item')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('delete-recipe-button'));
    expect(screen.queryByTestId('saved-recipe-item')).not.toBeInTheDocument();
    expect(screen.getByTestId('no-saved-recipes')).toBeInTheDocument();
  });

  it('orders favorites before non-favorites', async () => {
    renderPanel();
    await saveRecipe('First');
    await saveRecipe('Second');
    // Favorite the older recipe (currently rendered last).
    const favButtons = screen.getAllByTestId('favorite-recipe-button');
    await userEvent.click(favButtons[1]);
    const names = screen.getAllByTestId('saved-recipe-name').map((n) => n.textContent);
    expect(names[0]).toBe('First');
  });
});
