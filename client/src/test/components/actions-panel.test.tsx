import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionsPanel } from '@/components/actions-panel';

const t = (key: string) => key;

const exportRecipe = () => ({
  title: "Juanje's Golden Gazpacho Recipe",
  ingredients: { tomato: 1000 },
  volume: '1.47L',
  mode: 'original',
  exportDate: '2026-07-17T00:00:00.000Z',
});

const ingredients = { tomato: 1000, cucumber: 333.33 };
const volume = 1.47;

function renderPanel() {
  return render(
    <ActionsPanel exportRecipe={exportRecipe} ingredients={ingredients} volume={volume} t={t} />
  );
}

describe('ActionsPanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the export, copy, share and print buttons', () => {
    renderPanel();
    expect(screen.getByTestId('export-recipe-button')).toBeInTheDocument();
    expect(screen.getByTestId('export-text-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-link-button')).toBeInTheDocument();
    expect(screen.getByTestId('share-social-button')).toBeInTheDocument();
    expect(screen.getByTestId('share-text-button')).toBeInTheDocument();
    expect(screen.getByTestId('print-recipe-button')).toBeInTheDocument();
  });

  it('renders the community counter and tips', () => {
    renderPanel();
    // Grouping separator depends on the runtime locale/ICU data, so match loosely.
    expect(screen.getByTestId('made-counter')).toHaveTextContent(/2[,.]?847/);
    expect(screen.getByTestId('made-it-button')).toBeInTheDocument();
    expect(screen.getByText('tip1')).toBeInTheDocument();
    expect(screen.getByText('tip4')).toBeInTheDocument();
  });

  it('exporting the recipe creates and revokes an object URL', async () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderPanel();
    await userEvent.click(screen.getByTestId('export-recipe-button'));

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('copying the link writes the current URL to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    renderPanel();
    await userEvent.click(screen.getByTestId('copy-link-button'));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it('sharing uses the Web Share API when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share });

    renderPanel();
    await userEvent.click(screen.getByTestId('share-social-button'));

    expect(share).toHaveBeenCalledOnce();
  });

  it('exporting as text creates and revokes an object URL with a .txt filename', async () => {
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:mock-text');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderPanel();
    await userEvent.click(screen.getByTestId('export-text-button'));

    expect(createObjectURL).toHaveBeenCalledOnce();
    const blobArg = createObjectURL.mock.calls[0][0] as Blob;
    expect(blobArg.type).toBe('text/plain');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-text');
    clickSpy.mockRestore();
  });

  it('sharing as text uses the Web Share API with the formatted recipe text', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share });

    renderPanel();
    await userEvent.click(screen.getByTestId('share-text-button'));

    expect(share).toHaveBeenCalledOnce();
    const payload = share.mock.calls[0][0];
    expect(payload.text).toContain('tomato: 1000 g');
  });

  it('sharing as text falls back to clipboard copy when the Web Share API is unavailable', async () => {
    Object.assign(navigator, { share: undefined });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    renderPanel();
    await userEvent.click(screen.getByTestId('share-text-button'));

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain('tomato: 1000 g');
  });

  it('sharing as text falls back to clipboard copy when the share call rejects', async () => {
    const share = vi.fn().mockRejectedValue(new Error('cancelled'));
    Object.assign(navigator, { share });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    renderPanel();
    await userEvent.click(screen.getByTestId('share-text-button'));

    expect(writeText).toHaveBeenCalledOnce();
  });

  it('printing triggers window.print', async () => {
    const print = vi.fn();
    vi.stubGlobal('print', print);

    renderPanel();
    await userEvent.click(screen.getByTestId('print-recipe-button'));

    expect(print).toHaveBeenCalledOnce();
  });

  it('marking as made increments the counter and disables the button', async () => {
    renderPanel();
    const button = screen.getByTestId('made-it-button');
    expect(button).not.toBeDisabled();

    await userEvent.click(button);

    expect(screen.getByTestId('made-counter')).toHaveTextContent(/2[,.]?848/);
    expect(screen.getByTestId('made-it-button')).toBeDisabled();
    expect(localStorage.getItem('gazpacho-user-made')).toBe('true');
  });

  it('shows the already-made state when the user has already marked it', () => {
    localStorage.setItem('gazpacho-user-made', 'true');
    renderPanel();
    expect(screen.getByTestId('made-it-button')).toBeDisabled();
  });
});
