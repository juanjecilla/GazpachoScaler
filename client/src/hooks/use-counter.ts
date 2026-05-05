import { useState } from 'react';

const STORAGE_KEY_COUNT = 'gazpacho-counter';
const STORAGE_KEY_MADE = 'gazpacho-user-made';
const DEFAULT_COUNT = 2847;

export function useCounter() {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY_COUNT);
    return stored ? parseInt(stored, 10) : DEFAULT_COUNT;
  });

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
