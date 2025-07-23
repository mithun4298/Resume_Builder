import { useEffect, useRef } from 'react';

export function useAutoSave<T>(value: T, key: string, delay = 1000) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, key, delay]);
}
