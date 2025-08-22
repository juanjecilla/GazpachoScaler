import { useState, useCallback } from 'react';
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { LanguageSelector } from '@/components/language-selector';
import { RecipeModeSelector } from '@/components/recipe-mode-selector';
import { RecipeCalculator } from '@/components/recipe-calculator';
import { ActionsPanel } from '@/components/actions-panel';
import { useRecipe } from '@/hooks/use-recipe';
import { Button } from '@/components/ui/button';
import { translations, type Language } from '@/lib/translations';
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
      className="rounded-full bg-parchment-100 dark:bg-ancient-800 border-parchment-400 dark:border-ancient-600 hover:bg-parchment-200 dark:hover:bg-ancient-700 shadow-lg"
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
    getProportionLabel
  } = useRecipe();

  const t = useCallback((key: string): string => {
    return translations[currentLanguage]?.[key as keyof typeof translations.en] || key;
  }, [currentLanguage]);

  const handleLanguageChange = useCallback((language: Language) => {
    setCurrentLanguage(language);
  }, []);

  const showNotification = useCallback((message: string) => {
    // This would be handled by the toast system in ActionsPanel
    console.log('Notification:', message);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      {/* Theme and Language Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <LanguageSelector onLanguageChange={handleLanguageChange} />
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-ancient-700 dark:text-parchment-100 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-parchment-400 to-parchment-600">
                Juanje's
              </span>
              <br />
              <span className="text-ancient-700 dark:text-parchment-100">
                Golden Gazpacho
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-parchment-400 to-parchment-600 mx-auto rounded-full mb-4"></div>
            <p className="font-crimson text-xl md:text-2xl text-ancient-600 dark:text-parchment-200 max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        {/* Recipe Mode Selector */}
        <div className="mb-8">
          <RecipeModeSelector
            mode={mode}
            onModeChange={switchMode}
            t={t}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
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
            <ActionsPanel
              exportRecipe={exportRecipe}
              t={t}
            />
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
