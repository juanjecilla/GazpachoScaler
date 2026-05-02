import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeModeSelector } from '@/components/recipe-mode-selector';

const t = (key: string) => key;

describe('RecipeModeSelector', () => {
  it('renders both mode buttons', () => {
    render(<RecipeModeSelector mode="original" onModeChange={vi.fn()} t={t} />);
    expect(screen.getByTestId('original-recipe-button')).toBeInTheDocument();
    expect(screen.getByTestId('custom-recipe-button')).toBeInTheDocument();
  });

  it('original button uses default variant when mode is original', () => {
    render(<RecipeModeSelector mode="original" onModeChange={vi.fn()} t={t} />);
    const btn = screen.getByTestId('original-recipe-button');
    expect(btn.className).toContain('from-parchment-400');
  });

  it('custom button uses default variant when mode is custom', () => {
    render(<RecipeModeSelector mode="custom" onModeChange={vi.fn()} t={t} />);
    const btn = screen.getByTestId('custom-recipe-button');
    expect(btn.className).toContain('from-parchment-400');
  });

  it('clicking custom button calls onModeChange with "custom"', async () => {
    const onModeChange = vi.fn();
    render(<RecipeModeSelector mode="original" onModeChange={onModeChange} t={t} />);
    await userEvent.click(screen.getByTestId('custom-recipe-button'));
    expect(onModeChange).toHaveBeenCalledWith('custom');
  });

  it('clicking original button calls onModeChange with "original"', async () => {
    const onModeChange = vi.fn();
    render(<RecipeModeSelector mode="custom" onModeChange={onModeChange} t={t} />);
    await userEvent.click(screen.getByTestId('original-recipe-button'));
    expect(onModeChange).toHaveBeenCalledWith('original');
  });
});
