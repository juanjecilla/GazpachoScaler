import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, RotateCcw } from 'lucide-react';
import { INGREDIENTS } from '@/lib/recipe-calculator';

interface RecipeCalculatorProps {
  ingredients: Record<string, number>;
  volume: number;
  onIngredientChange: (ingredient: string, value: number) => void;
  onReset: () => void;
  getProportionLabel: (ingredient: string) => string;
  t: (key: string) => string;
}

export function RecipeCalculator({ 
  ingredients, 
  volume, 
  onIngredientChange, 
  onReset, 
  getProportionLabel,
  t 
}: RecipeCalculatorProps) {
  return (
    <Card className="bg-parchment-100 dark:bg-ancient-800 border-2 border-parchment-300 dark:border-ancient-600 shadow-xl">
      <CardHeader>
        <CardTitle className="font-playfair text-3xl font-bold text-ancient-700 dark:text-parchment-100 flex items-center gap-3">
          <Scale className="h-8 w-8 text-parchment-500" />
          {t('ingredients')}
        </CardTitle>
        
        {/* Volume Estimation */}
        <div className="p-4 bg-gradient-to-r from-parchment-200 to-parchment-300 dark:from-ancient-700 dark:to-ancient-600 rounded-xl border border-parchment-400 dark:border-ancient-500">
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
            className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-parchment-50 dark:bg-ancient-800 border border-parchment-200 dark:border-ancient-700 rounded-xl"
          >
            <div className="flex items-center gap-3 md:w-1/3">
              <i className={`${icon} text-parchment-500 text-xl w-6`}></i>
              <span className="font-inter font-medium text-ancient-700 dark:text-parchment-200">
                {t(key)}
              </span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={ingredients[key]?.toFixed(2) || '0'}
                onChange={(e) => onIngredientChange(key, parseFloat(e.target.value) || 0)}
                className="flex-1 bg-white dark:bg-ancient-900 border-parchment-300 dark:border-ancient-600 text-ancient-700 dark:text-parchment-200 focus:ring-parchment-400 dark:focus:ring-parchment-500"
                data-testid={`input-${key}`}
              />
              <span className="px-3 py-3 text-ancient-600 dark:text-parchment-300 font-inter text-sm min-w-[40px]">
                g
              </span>
            </div>
            <div className="md:w-24 text-center">
              <span 
                className="text-xs text-ancient-500 dark:text-parchment-400 font-inter"
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
            className="bg-gradient-to-r from-ancient-600 to-ancient-700 text-parchment-100 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="reset-recipe-button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('reset_recipe')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
