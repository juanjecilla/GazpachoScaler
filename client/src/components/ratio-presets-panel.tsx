import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRatioPresets } from '@/hooks/use-ratio-presets';
import type { RatioPreset } from '@/lib/ratio-presets-storage';
import type { IngredientKey } from '@/lib/recipe-calculator';
import type { TFunction } from '@/lib/translations';
import { SlidersHorizontal, Download, Trash2, Lock } from 'lucide-react';

interface RatioPresetsPanelProps {
  currentProportions: Record<string, number>;
  onLoad: (proportions: Record<IngredientKey, number>) => void;
  t: TFunction;
}

/**
 * Named ratio presets for custom mode. Save the current custom proportions under
 * a name, then list / load / delete them. The built-in default preset always
 * leads the list, is shown with its translated name, and cannot be deleted (it
 * is synthesized at runtime by {@link useRatioPresets} and never persisted).
 */
export function RatioPresetsPanel({ currentProportions, onLoad, t }: RatioPresetsPanelProps) {
  const { toast } = useToast();
  const { presets, isBuiltIn, savePreset, deletePreset } = useRatioPresets();
  const [name, setName] = useState('');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    savePreset({
      name: trimmed,
      proportions: currentProportions as Record<IngredientKey, number>,
    });
    setName('');
    toast({ title: t('preset_saved'), description: '' });
  };

  const handleLoad = (preset: RatioPreset) => {
    onLoad(preset.proportions);
    toast({ title: t('preset_loaded'), description: '' });
  };

  const displayName = (preset: RatioPreset) =>
    isBuiltIn(preset.id) ? t('default_preset_name') : preset.name;

  return (
    <Card
      className="border-2 border-parchment-300 bg-parchment-100 shadow-lg dark:border-ancient-600 dark:bg-ancient-800"
      data-testid="ratio-presets-panel"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100">
          <SlidersHorizontal className="h-6 w-6 text-parchment-500" />
          {t('ratio_presets')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save current proportions as a preset */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder={t('preset_name')}
            aria-label={t('preset_name')}
            className="flex-1 border-parchment-300 bg-white text-ancient-700 focus:ring-parchment-400 dark:border-ancient-600 dark:bg-ancient-900 dark:text-parchment-200"
            data-testid="save-preset-name-input"
          />
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
            data-testid="save-preset-button"
          >
            {t('save_preset')}
          </Button>
        </div>

        {/* Preset list — built-in first, then user presets */}
        <ul className="space-y-2">
          {presets.map((preset) => {
            const builtIn = isBuiltIn(preset.id);
            return (
              <li
                key={preset.id}
                className="flex items-center gap-2 rounded-xl border border-parchment-200 bg-parchment-50 p-3 dark:border-ancient-700 dark:bg-ancient-900"
                data-testid="ratio-preset-item"
                data-builtin={builtIn}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {builtIn && (
                    <Lock
                      className="h-3.5 w-3.5 shrink-0 text-parchment-500 dark:text-parchment-400"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="font-inter truncate font-medium text-ancient-700 dark:text-parchment-200"
                    data-testid="ratio-preset-name"
                  >
                    {displayName(preset)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLoad(preset)}
                    title={t('load_preset')}
                    aria-label={t('load_preset')}
                    className="h-8 w-8 text-ancient-600 hover:text-ancient-800 dark:text-parchment-300"
                    data-testid="load-preset-button"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {!builtIn && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePreset(preset.id)}
                      title={t('delete_preset')}
                      aria-label={t('delete_preset')}
                      className="h-8 w-8 text-ancient-500 hover:text-red-600 dark:text-parchment-400 dark:hover:text-red-400"
                      data-testid="delete-preset-button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
