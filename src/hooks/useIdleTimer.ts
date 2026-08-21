import { useEffect, useRef } from 'react';

const IDLE_EVENTS = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'] as const;

export function useIdleTimer(onIdle: () => void, timeoutMs = 15 * 60 * 1000): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onIdleRef.current(), timeoutMs);
    };
    reset();
    IDLE_EVENTS.forEach(event => window.addEventListener(event, reset, { passive: true }));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      IDLE_EVENTS.forEach(event => window.removeEventListener(event, reset));
    };
  }, [timeoutMs]);
}
