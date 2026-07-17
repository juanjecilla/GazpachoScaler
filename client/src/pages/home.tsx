import { useState, useCallback } from 'react';
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { LanguageSelector } from '@/components/language-selector';
import { RecipeModeSelector } from '@/components/recipe-mode-selector';
import { RecipeCalculator } from '@/components/recipe-calculator';
import { ActionsPanel } from '@/components/actions-panel';
import { useRecipe } from '@/hooks/use-recipe';
import { Button } from '@/components/ui/button';
import { translations, type Language, type TranslationKey } from '@/lib/translations';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full border-parchment-400 bg-parchment-100 shadow-lg hover:bg-parchment-200 dark:border-ancient-600 dark:bg-ancient-800 dark:hover:bg-ancient-700"
      data-testid="theme-toggle-button"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-parchment-200" />
      ) : (
        <Moon className="h-4 w-4 text-ancient-700" />
      )}
    </Button>
  );
}

function HomeContent() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const {
    ingredients,
    volume,
    mode,
    updateIngredient,
    switchMode,
    resetToOriginal,
    exportRecipe,
    getProportionLabel,
  } = useRecipe();

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[currentLanguage]?.[key] || key;
    },
    [currentLanguage]
  );

  const handleLanguageChange = useCallback((language: Language) => {
    setCurrentLanguage(language);
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Theme and Language Controls */}
      <div className="fixed right-4 top-4 z-50 flex gap-2">
        <LanguageSelector onLanguageChange={handleLanguageChange} />
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="px-4 py-12 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <h1 className="mb-4 font-playfair text-5xl font-bold text-ancient-700 dark:text-parchment-100 md:text-7xl">
              <span className="bg-gradient-to-r from-parchment-400 to-parchment-600 bg-clip-text text-transparent">
                Juanje's
              </span>
              <br />
              <span className="text-ancient-700 dark:text-parchment-100">Golden Gazpacho</span>
            </h1>
            <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-parchment-400 to-parchment-600"></div>
            <p className="mx-auto max-w-2xl font-crimson text-xl leading-relaxed text-ancient-600 dark:text-parchment-200 md:text-2xl">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* Recipe Mode Selector */}
        <div className="mb-8">
          <RecipeModeSelector mode={mode} onModeChange={switchMode} t={t} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Ingredients Calculator */}
          <div className="lg:col-span-2">
            <RecipeCalculator
              ingredients={ingredients}
              volume={volume}
              onIngredientChange={updateIngredient}
              onReset={resetToOriginal}
              getProportionLabel={getProportionLabel}
              t={t}
            />
          </div>

          {/* Actions Panel */}
          <div>
            <ActionsPanel exportRecipe={exportRecipe} t={t} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="gazpacho-theme">
      <HomeContent />
    </ThemeProvider>
  );
}
