import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRecipeHistory } from '@/hooks/use-recipe-history';
import type { SavedRecipe } from '@/lib/recipe-history-storage';
import type { IngredientKey } from '@/lib/recipe-calculator';
import type { TFunction } from '@/lib/translations';
import { BookOpen, Star, Download, Trash2 } from 'lucide-react';

interface RecipeHistoryPanelProps {
  currentMode: 'original' | 'custom';
  currentIngredients: Record<string, number>;
  onLoad: (recipe: SavedRecipe) => void;
  t: TFunction;
}

export function RecipeHistoryPanel({
  currentMode,
  currentIngredients,
  onLoad,
  t,
}: RecipeHistoryPanelProps) {
  const { toast } = useToast();
  const { savedRecipes, saveRecipe, deleteRecipe, toggleFavorite, isFavorite } = useRecipeHistory();
  const [name, setName] = useState('');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveRecipe({
      name: trimmed,
      mode: currentMode,
      ingredients: currentIngredients as Record<IngredientKey, number>,
    });
    setName('');
    toast({ title: t('recipe_saved'), description: '' });
  };

  const handleLoad = (recipe: SavedRecipe) => {
    onLoad(recipe);
    toast({ title: t('recipe_loaded'), description: '' });
  };

  // Favorites float to the top; within each group the newest stays first.
  const orderedRecipes = [...savedRecipes].sort((a, b) => {
    const favDelta = Number(isFavorite(b.id)) - Number(isFavorite(a.id));
    return favDelta;
  });

  return (
    <Card className="border-2 border-parchment-300 bg-parchment-100 shadow-lg dark:border-ancient-600 dark:bg-ancient-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100">
          <BookOpen className="h-6 w-6 text-parchment-500" />
          {t('saved_recipes')}
          {savedRecipes.length > 0 && (
            <span
              className="ml-1 rounded-full bg-parchment-300 px-2 py-0.5 text-sm text-ancient-700 dark:bg-ancient-600 dark:text-parchment-200"
              data-testid="saved-recipes-count"
            >
              {savedRecipes.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save current recipe */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder={t('recipe_name')}
            aria-label={t('recipe_name')}
            className="flex-1 border-parchment-300 bg-white text-ancient-700 focus:ring-parchment-400 dark:border-ancient-600 dark:bg-ancient-900 dark:text-parchment-200"
            data-testid="save-recipe-name-input"
          />
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
            data-testid="save-recipe-button"
          >
            {t('save_recipe')}
          </Button>
        </div>

        {/* Saved recipe list */}
        {orderedRecipes.length === 0 ? (
          <p
            className="font-inter py-2 text-center text-sm text-ancient-500 dark:text-parchment-400"
            data-testid="no-saved-recipes"
          >
            {t('no_saved_recipes')}
          </p>
        ) : (
          <ul className="space-y-2">
            {orderedRecipes.map((recipe) => (
              <li
                key={recipe.id}
                className="flex items-center gap-2 rounded-xl border border-parchment-200 bg-parchment-50 p-3 dark:border-ancient-700 dark:bg-ancient-900"
                data-testid="saved-recipe-item"
              >
                <div className="min-w-0 flex-1">
                  <div
                    className="font-inter truncate font-medium text-ancient-700 dark:text-parchment-200"
                    data-testid="saved-recipe-name"
                  >
                    {recipe.name}
                  </div>
                  <div className="font-inter text-xs text-ancient-500 dark:text-parchment-400">
                    {Math.round(recipe.ingredients.tomato)}g ·{' '}
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(recipe.id)}
                    title={t('favorite_recipe')}
                    aria-label={t('favorite_recipe')}
                    aria-pressed={isFavorite(recipe.id)}
                    className="h-8 w-8 text-parchment-500 hover:text-parchment-600 dark:text-parchment-400"
                    data-testid="favorite-recipe-button"
                  >
                    <Star
                      className={`h-4 w-4 ${isFavorite(recipe.id) ? 'fill-current' : ''}`}
                      data-favorited={isFavorite(recipe.id)}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLoad(recipe)}
                    title={t('load_recipe')}
                    aria-label={t('load_recipe')}
                    className="h-8 w-8 text-ancient-600 hover:text-ancient-800 dark:text-parchment-300"
                    data-testid="load-recipe-button"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRecipe(recipe.id)}
                    title={t('delete_recipe')}
                    aria-label={t('delete_recipe')}
                    className="h-8 w-8 text-ancient-500 hover:text-red-600 dark:text-parchment-400 dark:hover:text-red-400"
                    data-testid="delete-recipe-button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
