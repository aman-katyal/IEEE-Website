import { useSyncExternalStore, useCallback, useRef } from "react";

function dispatchStorageEvent(key: string, newValue: string | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
  }
}

/**
 * Type-safe localStorage hook with React 19 useSyncExternalStore concurrency alignment.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const handler = (e: StorageEvent) => {
        if (e.key === key || e.key === null) {
          callback();
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [key]
  );

  const getSnapshot = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback((): string | null => null, []);

  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let storedValue: T = initialValueRef.current;
  if (rawValue !== null) {
    try {
      storedValue = JSON.parse(rawValue) as T;
    } catch {
      storedValue = initialValueRef.current;
    }
  }

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        if (typeof window === "undefined") return;
        const currentRaw = window.localStorage.getItem(key);
        let currentParsed: T = initialValueRef.current;
        if (currentRaw !== null) {
          try {
            currentParsed = JSON.parse(currentRaw) as T;
          } catch {}
        }
        const valueToStore = value instanceof Function ? value(currentParsed) : value;
        const serialized = JSON.stringify(valueToStore);
        window.localStorage.setItem(key, serialized);
        dispatchStorageEvent(key, serialized);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
      dispatchStorageEvent(key, null);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}
