import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeCalculator } from '@/components/recipe-calculator';
import { ORIGINAL_PROPORTIONS } from '@/lib/recipe-calculator';

const t = (key: string) => key;
const getProportionLabel = (key: string) => (key === 'tomato' ? 'Base' : '1/3');

describe('RecipeCalculator', () => {
  const defaultProps = {
    ingredients: ORIGINAL_PROPORTIONS,
    volume: 1.47,
    onIngredientChange: vi.fn(),
    onReset: vi.fn(),
    getProportionLabel,
    t,
  };

  it('renders all 7 ingredient inputs', () => {
    render(<RecipeCalculator {...defaultProps} />);
    const inputs = [
      'tomato',
      'cucumber',
      'greenPepper',
      'garlic',
      'oliveOil',
      'salt',
      'jerezVinegar',
    ];
    inputs.forEach((key) => {
      expect(screen.getByTestId(`input-${key}`)).toBeInTheDocument();
    });
  });

  it('renders volume display', () => {
    render(<RecipeCalculator {...defaultProps} />);
    expect(screen.getByTestId('volume-display')).toBeInTheDocument();
    expect(screen.getByTestId('volume-display')).toHaveTextContent('1.47L');
  });

  it('renders reset button', () => {
    render(<RecipeCalculator {...defaultProps} />);
    expect(screen.getByTestId('reset-recipe-button')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    render(<RecipeCalculator {...defaultProps} onReset={onReset} />);
    await userEvent.click(screen.getByTestId('reset-recipe-button'));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('calls onIngredientChange when tomato input changes', async () => {
    const onIngredientChange = vi.fn();
    render(<RecipeCalculator {...defaultProps} onIngredientChange={onIngredientChange} />);
    const tomatoInput = screen.getByTestId('input-tomato');
    await userEvent.clear(tomatoInput);
    await userEvent.type(tomatoInput, '2000');
    expect(onIngredientChange).toHaveBeenCalled();
  });

  it('renders proportion labels', () => {
    render(<RecipeCalculator {...defaultProps} />);
    expect(screen.getByTestId('proportion-tomato')).toHaveTextContent('Base');
  });
});
