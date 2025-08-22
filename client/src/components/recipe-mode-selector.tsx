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
    <Card className="bg-parchment-100 dark:bg-ancient-800 border-2 border-parchment-300 dark:border-ancient-600 shadow-lg">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100 flex items-center gap-2">
          <Settings className="h-6 w-6 text-parchment-500" />
          {t('recipe_mode')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => onModeChange('original')}
            variant={mode === 'original' ? 'default' : 'outline'}
            className={mode === 'original' 
              ? 'bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200'
              : 'bg-parchment-200 dark:bg-ancient-700 text-ancient-700 dark:text-parchment-200 border-2 border-parchment-300 dark:border-ancient-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200'
            }
            data-testid="original-recipe-button"
          >
            <Scroll className="w-4 h-4 mr-2" />
            {t('original_recipe')}
          </Button>
          <Button
            onClick={() => onModeChange('custom')}
            variant={mode === 'custom' ? 'default' : 'outline'}
            className={mode === 'custom'
              ? 'bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200'
              : 'bg-parchment-200 dark:bg-ancient-700 text-ancient-700 dark:text-parchment-200 border-2 border-parchment-300 dark:border-ancient-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200'
            }
            data-testid="custom-recipe-button"
          >
            <Edit className="w-4 h-4 mr-2" />
            {t('custom_recipe')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
