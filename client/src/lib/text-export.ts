import type { TFunction } from './translations';
import { INGREDIENTS, estimateServings } from './recipe-calculator';

/**
 * The site's brand name doubles as the recipe title everywhere it's
 * exported (JSON, text, share payload). It mirrors `RecipeCalculator.exportRecipe()`
 * and — like that title — is intentionally left untranslated.
 */
export const RECIPE_TITLE = "Juanje's Golden Gazpacho Recipe";

export interface RecipeTextInput {
  ingredients: Record<string, number>;
  volume: number;
}

/**
 * Build a human-readable, plain-text rendering of the current recipe.
 * Used for the Web Share API text payload, the clipboard fallback, and
 * the `.txt` download. Ingredient names and the volume/servings labels
 * are localized through `t`, so the output is generated in whatever
 * language the UI is currently showing.
 */
export function buildRecipeText({ ingredients, volume }: RecipeTextInput, t: TFunction): string {
  const header = `${RECIPE_TITLE}\n${'='.repeat(RECIPE_TITLE.length)}\n\n`;

  const lines = INGREDIENTS.map(({ key }) => {
    const amount = Math.round(ingredients[key] ?? 0);
    return `• ${t(key)}: ${amount} g`;
  }).join('\n');

  const footer = `\n\n${t('estimated_volume')} ${volume.toFixed(2)}L\n${t('estimated_servings')} ${estimateServings(volume)}`;

  return `${header}${lines}${footer}`;
}
