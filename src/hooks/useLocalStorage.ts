import { useCallback, useState } from 'react';

function useLocalStorage<T>(key: string, defaultValue: T) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, [defaultValue, key]);

  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    },
    [key, storedValue]
  );

  return [readValue, setValue] as const;
}

export { useLocalStorage };
