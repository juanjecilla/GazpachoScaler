import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/use-counter';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useCounter', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('initializes to default count when localStorage is empty', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(2847);
  });

  it('initializes to stored count from localStorage', () => {
    localStorage.setItem('gazpacho-counter', '3000');
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(3000);
  });

  it('hasMade is false initially', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.hasMade).toBe(false);
  });

  it('hasMade is true when localStorage key is set', () => {
    localStorage.setItem('gazpacho-user-made', 'true');
    const { result } = renderHook(() => useCounter());
    expect(result.current.hasMade).toBe(true);
  });

  it('increment increases count by 1', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(2848);
  });

  it('increment sets localStorage flags', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(localStorage.getItem('gazpacho-user-made')).toBe('true');
    expect(localStorage.getItem('gazpacho-counter')).toBe('2848');
  });

  it('increment is a no-op when hasMade is true', () => {
    localStorage.setItem('gazpacho-user-made', 'true');
    localStorage.setItem('gazpacho-counter', '2900');
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(2900);
  });
});
