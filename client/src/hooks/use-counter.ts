import { useState } from 'react';

const STORAGE_KEY_COUNT = 'gazpacho-counter';
const STORAGE_KEY_MADE = 'gazpacho-user-made';
const DEFAULT_COUNT = 2847;

/**
 * Read the persisted counter, guarding against corrupt or wrong-shape data.
 * localStorage is user-writable and survives across app versions, so the
 * stored value can be missing, non-numeric ("abc"), a JSON blob, negative,
 * or NaN. Anything that is not a finite, non-negative integer falls back to
 * the default rather than propagating `NaN` into the UI.
 */
function readStoredCount(): number {
  const stored = localStorage.getItem(STORAGE_KEY_COUNT);
  if (stored === null) return DEFAULT_COUNT;

  const parsed = Number.parseInt(stored, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return DEFAULT_COUNT;

  return parsed;
}

export function useCounter() {
  const [count, setCount] = useState(readStoredCount);

  const hasMade = localStorage.getItem(STORAGE_KEY_MADE) === 'true';

  function increment() {
    if (hasMade) return;
    const next = count + 1;
    setCount(next);
    localStorage.setItem(STORAGE_KEY_COUNT, String(next));
    localStorage.setItem(STORAGE_KEY_MADE, 'true');
  }

  return { count, increment, hasMade };
}
