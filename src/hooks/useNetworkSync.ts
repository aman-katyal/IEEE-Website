import { useState, useEffect, useRef } from 'react';

export interface UseNetworkSyncOptions {
  onReconnect?: () => void | Promise<void>;
  onDisconnect?: () => void;
}

export interface UseNetworkSyncResult {
  isOnline: boolean;
  wasOffline: boolean;
  revalidateCount: number;
}

/**
 * Hook that detects browser online/offline state transitions and triggers
 * silent background revalidation callbacks when connectivity is restored.
 */
export function useNetworkSync(options: UseNetworkSyncOptions = {}): UseNetworkSyncResult {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState(false);
  const [revalidateCount, setRevalidateCount] = useState(0);

  const onReconnectRef = useRef(options.onReconnect);
  onReconnectRef.current = options.onReconnect;

  const onDisconnectRef = useRef(options.onDisconnect);
  onDisconnectRef.current = options.onDisconnect;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setRevalidateCount((c) => c + 1);
      onReconnectRef.current?.();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      onDisconnectRef.current?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline, revalidateCount };
}
