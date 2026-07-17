import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import type { TFunction } from '@/lib/translations';
import { RefreshCw, X } from 'lucide-react';

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

interface PwaUpdatePromptProps {
  t: TFunction;
}

/**
 * Floating "new version available" banner, shown once the service worker
 * has fetched an update and is waiting to activate. Only mounted in
 * production builds (see `home.tsx`) — `pnpm dev` never registers a SW.
 */
export function PwaUpdatePrompt({ t }: PwaUpdatePromptProps) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (registration) {
        setInterval(() => registration.update(), UPDATE_CHECK_INTERVAL_MS);
      }
    },
  });

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border-2 border-parchment-300 bg-parchment-100 px-4 py-3 shadow-lg dark:border-ancient-600 dark:bg-ancient-800 print:hidden"
      data-testid="pwa-update-prompt"
    >
      <RefreshCw className="h-5 w-5 shrink-0 text-parchment-500" />
      <span className="font-inter text-sm text-ancient-700 dark:text-parchment-200">
        {t('pwa_update_available')}
      </span>
      <Button
        onClick={() => updateServiceWorker(true)}
        size="sm"
        className="bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
        data-testid="pwa-update-reload-button"
      >
        {t('pwa_update_reload')}
      </Button>
      <Button
        onClick={() => setNeedRefresh(false)}
        variant="ghost"
        size="icon"
        aria-label={t('pwa_update_dismiss')}
        className="h-8 w-8 text-ancient-500 hover:text-ancient-700 dark:text-parchment-400 dark:hover:text-parchment-200"
        data-testid="pwa-update-dismiss-button"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
