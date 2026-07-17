import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/pages/home';
import { translations } from '@/lib/translations';

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the header subtitle in English by default', () => {
    render(<Home />);
    expect(screen.getByText(translations.en.subtitle)).toBeInTheDocument();
  });

  it('wires up the recipe sections and controls', () => {
    render(<Home />);
    expect(screen.getByTestId('original-recipe-button')).toBeInTheDocument();
    expect(screen.getByTestId('custom-recipe-button')).toBeInTheDocument();
    expect(screen.getByTestId('volume-display')).toBeInTheDocument();
    expect(screen.getByTestId('made-counter')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector-button')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
  });

  it('renders ingredient names via the translation table (no raw keys)', () => {
    render(<Home />);
    // greenPepper/oliveOil/jerezVinegar used to leak their raw keys; they now
    // resolve through the (renamed) translation entries.
    expect(screen.getByText(translations.en.greenPepper)).toBeInTheDocument();
    expect(screen.getByText(translations.en.oliveOil)).toBeInTheDocument();
    expect(screen.getByText(translations.en.jerezVinegar)).toBeInTheDocument();
  });

  it('toggling the theme persists the choice', async () => {
    render(<Home />);
    await userEvent.click(screen.getByTestId('theme-toggle-button'));
    await waitFor(() => expect(localStorage.getItem('gazpacho-theme')).not.toBeNull());
  });

  it('switching the language re-renders the subtitle in the chosen language', async () => {
    render(<Home />);
    await userEvent.click(screen.getByTestId('language-selector-button'));
    await userEvent.click(await screen.findByTestId('language-option-es'));

    await waitFor(() => expect(screen.getByText(translations.es.subtitle)).toBeInTheDocument());
  });
});
