import { useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';

interface UseAutoSaveOptions {
  delay?: number;
  onSave: (data: any) => Promise<void>;
  onError?: (error: Error) => void;
}

export const useAutoSave = <T>(
  data: T,
  options: UseAutoSaveOptions
) => {
  const { delay = 2000, onSave, onError } = options;
  const lastSavedData = useRef<T>();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSave = useCallback(
    debounce(async (dataToSave: T) => {
      try {
        await onSave(dataToSave);
        lastSavedData.current = dataToSave;
      } catch (error) {
        onError?.(error as Error);
      }
    }, delay),
    [onSave, onError, delay]
  );

  useEffect(() => {
    // Only save if data has actually changed
    if (JSON.stringify(data) !== JSON.stringify(lastSavedData.current)) {
      debouncedSave(data);
    }

    return () => {
      debouncedSave.cancel();
    };
  }, [data, debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
};
