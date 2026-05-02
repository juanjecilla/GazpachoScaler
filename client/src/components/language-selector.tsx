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
  de: '🇩🇪',
} as const;

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
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
          size="sm"
          className="gap-1 rounded-full border-parchment-400 bg-parchment-100 shadow-lg hover:bg-parchment-200 dark:border-ancient-600 dark:bg-ancient-800 dark:hover:bg-ancient-700"
          data-testid="language-selector-button"
        >
          <Globe className="h-4 w-4 text-ancient-700 dark:text-parchment-200" />
          <span className="text-sm">{LANGUAGE_FLAGS[currentLanguage]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-parchment-400 bg-parchment-100 dark:border-ancient-600 dark:bg-ancient-800"
      >
        {Object.entries(LANGUAGE_FLAGS).map(([lang, flag]) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang as Language)}
            className="cursor-pointer text-ancient-700 hover:bg-parchment-200 dark:text-parchment-200 dark:hover:bg-ancient-700"
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
