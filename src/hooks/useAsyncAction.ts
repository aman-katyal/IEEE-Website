import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useAsyncAction Hook
 * Wraps asynchronous operations with loading state, error catching, and unmount protection.
 */
export function useAsyncAction<T, Args extends unknown[]>(
  actionFn: (...args: Args) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await actionFn(...args);
        if (isMountedRef.current) {
          setLoading(false);
        }
        return result;
      } catch (err) {
        if (isMountedRef.current) {
          const formattedError =
            err instanceof Error ? err : new Error(String(err || 'Async operation failed'));
          setError(formattedError);
          setLoading(false);
        }
        return null;
      }
    },
    [actionFn]
  );

  return {
    execute,
    loading,
    error,
  };
}
