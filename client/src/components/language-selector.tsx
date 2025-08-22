import { useState, useEffect } from 'react';
import { translations, type Language } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LANGUAGE_FLAGS = {
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪'
} as const;

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch'
} as const;

interface LanguageSelectorProps {
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('gazpacho-language') as Language;
    if (savedLanguage && savedLanguage in translations) {
      setCurrentLanguage(savedLanguage);
      onLanguageChange(savedLanguage);
    }
  }, [onLanguageChange]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('gazpacho-language', language);
    onLanguageChange(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-parchment-100 dark:bg-ancient-800 border-parchment-400 dark:border-ancient-600 hover:bg-parchment-200 dark:hover:bg-ancient-700 shadow-lg"
          data-testid="language-selector-button"
        >
          <Globe className="h-4 w-4 text-ancient-700 dark:text-parchment-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-parchment-100 dark:bg-ancient-800 border-parchment-400 dark:border-ancient-600"
      >
        {Object.entries(LANGUAGE_FLAGS).map(([lang, flag]) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang as Language)}
            className="text-ancient-700 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ancient-700 cursor-pointer"
            data-testid={`language-option-${lang}`}
          >
            <span className="mr-2">{flag}</span>
            {LANGUAGE_NAMES[lang as Language]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
