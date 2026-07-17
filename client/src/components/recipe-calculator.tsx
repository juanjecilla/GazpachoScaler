import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, RotateCcw } from 'lucide-react';
import { INGREDIENTS } from '@/lib/recipe-calculator';
import type { TFunction } from '@/lib/translations';

interface RecipeCalculatorProps {
  ingredients: Record<string, number>;
  volume: number;
  onIngredientChange: (ingredient: string, value: number) => void;
  onReset: () => void;
  getProportionLabel: (ingredient: string) => string;
  t: TFunction;
}

export function RecipeCalculator({
  ingredients,
  volume,
  onIngredientChange,
  onReset,
  getProportionLabel,
  t,
}: RecipeCalculatorProps) {
  return (
    <Card className="border-2 border-parchment-300 bg-parchment-100 shadow-xl dark:border-ancient-600 dark:bg-ancient-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-playfair text-3xl font-bold text-ancient-700 dark:text-parchment-100">
          <Scale className="h-8 w-8 text-parchment-500" />
          {t('ingredients')}
        </CardTitle>

        {/* Volume Estimation */}
        <div className="rounded-xl border border-parchment-400 bg-gradient-to-r from-parchment-200 to-parchment-300 p-4 dark:border-ancient-500 dark:from-ancient-700 dark:to-ancient-600">
          <div className="flex items-center justify-between">
            <span className="font-crimson text-lg text-ancient-700 dark:text-parchment-200">
              {t('estimated_volume')}
            </span>
            <span
              className="font-inter text-2xl font-bold text-parchment-600 dark:text-parchment-300"
              data-testid="volume-display"
            >
              {volume.toFixed(2)}L
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {INGREDIENTS.map(({ key, icon }) => (
          <div
            key={key}
            className="flex flex-col gap-4 rounded-xl border border-parchment-200 bg-parchment-50 p-4 dark:border-ancient-700 dark:bg-ancient-800 md:flex-row md:items-center"
          >
            <div className="flex items-center gap-3 md:w-1/3">
              <i className={`${icon} w-6 text-xl text-parchment-500`}></i>
              <span className="font-inter font-medium text-ancient-700 dark:text-parchment-200">
                {t(key)}
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={ingredients[key]?.toFixed(2) || '0'}
                onChange={(e) => onIngredientChange(key, parseFloat(e.target.value) || 0)}
                className="flex-1 border-parchment-300 bg-white text-ancient-700 focus:ring-parchment-400 dark:border-ancient-600 dark:bg-ancient-900 dark:text-parchment-200 dark:focus:ring-parchment-500"
                data-testid={`input-${key}`}
              />
              <span className="font-inter min-w-[40px] px-3 py-3 text-sm text-ancient-600 dark:text-parchment-300">
                g
              </span>
            </div>
            <div className="text-center md:w-24">
              <span
                className="font-inter text-xs text-ancient-500 dark:text-parchment-400"
                data-testid={`proportion-${key}`}
              >
                {getProportionLabel(key)}
              </span>
            </div>
          </div>
        ))}

        {/* Reset Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onReset}
            className="transform bg-gradient-to-r from-ancient-600 to-ancient-700 text-parchment-100 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
            data-testid="reset-recipe-button"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('reset_recipe')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
