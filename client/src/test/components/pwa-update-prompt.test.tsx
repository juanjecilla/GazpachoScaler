import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const useRegisterSW = vi.fn();

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: (...args: unknown[]) => useRegisterSW(...args),
}));

const t = (key: string) => key;

async function loadComponent() {
  const mod = await import('@/components/pwa-update-prompt');
  return mod.PwaUpdatePrompt;
}

describe('PwaUpdatePrompt', () => {
  beforeEach(() => {
    useRegisterSW.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when no update is available', async () => {
    const setNeedRefresh = vi.fn();
    useRegisterSW.mockReturnValue({
      needRefresh: [false, setNeedRefresh],
      updateServiceWorker: vi.fn(),
    });
    const PwaUpdatePrompt = await loadComponent();

    const { container } = render(<PwaUpdatePrompt t={t} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the banner and reloads via updateServiceWorker on click', async () => {
    const setNeedRefresh = vi.fn();
    const updateServiceWorker = vi.fn();
    useRegisterSW.mockReturnValue({
      needRefresh: [true, setNeedRefresh],
      updateServiceWorker,
    });
    const PwaUpdatePrompt = await loadComponent();

    render(<PwaUpdatePrompt t={t} />);
    expect(screen.getByTestId('pwa-update-prompt')).toBeInTheDocument();
    expect(screen.getByText('pwa_update_available')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('pwa-update-reload-button'));
    expect(updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('dismisses the banner without reloading', async () => {
    const setNeedRefresh = vi.fn();
    const updateServiceWorker = vi.fn();
    useRegisterSW.mockReturnValue({
      needRefresh: [true, setNeedRefresh],
      updateServiceWorker,
    });
    const PwaUpdatePrompt = await loadComponent();

    render(<PwaUpdatePrompt t={t} />);
    await userEvent.click(screen.getByTestId('pwa-update-dismiss-button'));

    expect(setNeedRefresh).toHaveBeenCalledWith(false);
    expect(updateServiceWorker).not.toHaveBeenCalled();
  });

  it('registers a periodic update check on registration', async () => {
    vi.useFakeTimers();
    const setInterval_ = vi.spyOn(globalThis, 'setInterval');
    const registration = { update: vi.fn() } as unknown as ServiceWorkerRegistration;

    useRegisterSW.mockImplementation((options?: { onRegistered?: (r?: unknown) => void }) => {
      options?.onRegistered?.(registration);
      return {
        needRefresh: [false, vi.fn()],
        updateServiceWorker: vi.fn(),
      };
    });
    const PwaUpdatePrompt = await loadComponent();

    render(<PwaUpdatePrompt t={t} />);

    expect(setInterval_).toHaveBeenCalledWith(expect.any(Function), 60 * 60 * 1000);
    vi.useRealTimers();
  });
});
