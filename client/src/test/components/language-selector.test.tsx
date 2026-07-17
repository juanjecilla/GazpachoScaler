import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSelector } from '@/components/language-selector';

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the trigger with the English flag by default', () => {
    render(<LanguageSelector onLanguageChange={vi.fn()} />);
    const trigger = screen.getByTestId('language-selector-button');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('🇬🇧');
  });

  it('restores a valid saved language from localStorage on mount', async () => {
    localStorage.setItem('gazpacho-language', 'es');
    const onLanguageChange = vi.fn();
    render(<LanguageSelector onLanguageChange={onLanguageChange} />);

    await waitFor(() => expect(onLanguageChange).toHaveBeenCalledWith('es'));
    expect(screen.getByTestId('language-selector-button')).toHaveTextContent('🇪🇸');
  });

  it('ignores an invalid saved language', () => {
    localStorage.setItem('gazpacho-language', 'xx');
    const onLanguageChange = vi.fn();
    render(<LanguageSelector onLanguageChange={onLanguageChange} />);

    expect(onLanguageChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('language-selector-button')).toHaveTextContent('🇬🇧');
  });

  it('selecting a language persists it and notifies the parent', async () => {
    const onLanguageChange = vi.fn();
    render(<LanguageSelector onLanguageChange={onLanguageChange} />);

    await userEvent.click(screen.getByTestId('language-selector-button'));
    const frenchOption = await screen.findByTestId('language-option-fr');
    await userEvent.click(frenchOption);

    expect(onLanguageChange).toHaveBeenCalledWith('fr');
    expect(localStorage.getItem('gazpacho-language')).toBe('fr');
    expect(screen.getByTestId('language-selector-button')).toHaveTextContent('🇫🇷');
  });
});
