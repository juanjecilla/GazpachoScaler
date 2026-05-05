import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Scroll, Edit } from 'lucide-react';

interface RecipeModeSelectorProps {
  mode: 'original' | 'custom';
  onModeChange: (mode: 'original' | 'custom') => void;
  t: (key: string) => string;
}

export function RecipeModeSelector({ mode, onModeChange, t }: RecipeModeSelectorProps) {
  return (
    <Card className="border-2 border-parchment-300 bg-parchment-100 shadow-lg dark:border-ancient-600 dark:bg-ancient-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100">
          <Settings className="h-6 w-6 text-parchment-500" />
          {t('recipe_mode')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => onModeChange('original')}
            variant={mode === 'original' ? 'default' : 'outline'}
            className={
              mode === 'original'
                ? 'transform bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'
                : 'transform border-2 border-parchment-300 bg-parchment-200 text-ancient-700 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg dark:border-ancient-600 dark:bg-ancient-700 dark:text-parchment-200'
            }
            data-testid="original-recipe-button"
          >
            <Scroll className="mr-2 h-4 w-4" />
            {t('original_recipe')}
          </Button>
          <Button
            onClick={() => onModeChange('custom')}
            variant={mode === 'custom' ? 'default' : 'outline'}
            className={
              mode === 'custom'
                ? 'transform bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'
                : 'transform border-2 border-parchment-300 bg-parchment-200 text-ancient-700 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg dark:border-ancient-600 dark:bg-ancient-700 dark:text-parchment-200'
            }
            data-testid="custom-recipe-button"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t('custom_recipe')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
