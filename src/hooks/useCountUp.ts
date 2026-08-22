import { useEffect, useState } from 'react';

export function useCountUp(target: number, duration = 1800, start = false): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || !target) {
      if (start && target === 0) setCount(0);
      return;
    }
    let startTime: number | null = null;
    let rafId: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [target, duration, start]);

  return count;
}
