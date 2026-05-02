export interface Ingredient {
  key: string;
  icon: string;
  proportion: number;
}

export const ORIGINAL_PROPORTIONS: Record<string, number> = {
  tomato: 1000, // Base - 1kg
  cucumber: 333.33, // 1/3 of tomato
  greenPepper: 166.67, // 1/6 of tomato
  garlic: 12, // 1.2% of tomato
  oliveOil: 15, // 1.5% of tomato
  salt: 6, // 0.6% of tomato
  jerezVinegar: 18, // 1.8% of tomato
};

export const INGREDIENTS: Ingredient[] = [
  { key: 'tomato', icon: 'fas fa-carrot', proportion: 1 },
  { key: 'cucumber', icon: 'fas fa-seedling', proportion: 1 / 3 },
  { key: 'greenPepper', icon: 'fas fa-pepper-hot', proportion: 1 / 6 },
  { key: 'garlic', icon: 'fas fa-seedling', proportion: 0.012 },
  { key: 'oliveOil', icon: 'fas fa-tint', proportion: 0.015 },
  { key: 'salt', icon: 'fas fa-cube', proportion: 0.006 },
  { key: 'jerezVinegar', icon: 'fas fa-wine-bottle', proportion: 0.018 },
];

export class RecipeCalculator {
  private proportions: Record<string, number>;
  private mode: 'original' | 'custom';

  constructor(mode: 'original' | 'custom' = 'original') {
    this.mode = mode;
    this.proportions = { ...ORIGINAL_PROPORTIONS };
  }

  setMode(mode: 'original' | 'custom') {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }

  updateIngredient(ingredient: string, value: number): Record<string, number> {
    if (this.mode === 'original') {
      // Calculate ratio based on original proportions
      const ratio = value / ORIGINAL_PROPORTIONS[ingredient];

      // Update all ingredients based on the ratio
      Object.keys(ORIGINAL_PROPORTIONS).forEach((key) => {
        this.proportions[key] = ORIGINAL_PROPORTIONS[key] * ratio;
      });
    } else {
      // In custom mode, only update the specific ingredient
      this.proportions[ingredient] = value;
    }

    return { ...this.proportions };
  }

  resetToOriginal(): Record<string, number> {
    this.proportions = { ...ORIGINAL_PROPORTIONS };
    return { ...this.proportions };
  }

  calculateVolume(): number {
    const totalWeight = Object.values(this.proportions).reduce((sum, weight) => sum + weight, 0);
    // Approximate density conversion (gazpacho is roughly 1.05 kg/L)
    return totalWeight / 1000 / 1.05;
  }

  getProportions(): Record<string, number> {
    return { ...this.proportions };
  }

  getProportionLabel(ingredient: string): string {
    const proportion = this.proportions[ingredient] / this.proportions.tomato;

    if (ingredient === 'tomato') return 'Base';
    if (proportion === 1 / 3) return '1/3';
    if (proportion === 1 / 6) return '1/6';

    const percentage = (proportion * 100).toFixed(1);
    return `${percentage}%`;
  }

  exportRecipe() {
    return {
      title: "Juanje's Golden Gazpacho Recipe",
      ingredients: this.proportions,
      volume: `${this.calculateVolume().toFixed(2)}L`,
      mode: this.mode,
      exportDate: new Date().toISOString(),
    };
  }
}
