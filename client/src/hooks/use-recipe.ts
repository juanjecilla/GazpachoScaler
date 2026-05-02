import { useState, useCallback, useEffect } from 'react';
import { RecipeCalculator, ORIGINAL_PROPORTIONS } from '@/lib/recipe-calculator';

export function useRecipe() {
  const [calculator] = useState(() => new RecipeCalculator());
  const [ingredients, setIngredients] = useState(ORIGINAL_PROPORTIONS);
  const [mode, setMode] = useState<'original' | 'custom'>('original');
  const [volume, setVolume] = useState(0);

  const updateIngredient = useCallback(
    (ingredient: string, value: number) => {
      const newIngredients = calculator.updateIngredient(ingredient, value);
      setIngredients(newIngredients);
      setVolume(calculator.calculateVolume());
    },
    [calculator]
  );

  const switchMode = useCallback(
    (newMode: 'original' | 'custom') => {
      calculator.setMode(newMode);
      setMode(newMode);
    },
    [calculator]
  );

  const resetToOriginal = useCallback(() => {
    const originalIngredients = calculator.resetToOriginal();
    setIngredients(originalIngredients);
    setVolume(calculator.calculateVolume());
  }, [calculator]);

  const exportRecipe = useCallback(() => {
    return calculator.exportRecipe();
  }, [calculator]);

  const getProportionLabel = useCallback(
    (ingredient: string) => {
      return calculator.getProportionLabel(ingredient);
    },
    [calculator]
  );

  useEffect(() => {
    setVolume(calculator.calculateVolume());
  }, [calculator]);

  return {
    ingredients,
    volume,
    mode,
    updateIngredient,
    switchMode,
    resetToOriginal,
    exportRecipe,
    getProportionLabel,
  };
}
