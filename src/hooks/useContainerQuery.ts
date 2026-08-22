import { useState, useEffect, useRef } from "react";

export interface ContainerDimensions {
  width: number;
  height: number;
  isSm: boolean; // >= 640px
  isMd: boolean; // >= 768px
  isLg: boolean; // >= 1024px
  isXl: boolean; // >= 1280px
}

/**
 * Standardized Container Query hook powered by ResizeObserver.
 */
export function useContainerQuery<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  ContainerDimensions
] {
  const ref = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setDimensions({
        width: Math.round(width),
        height: Math.round(height),
        isSm: width >= 640,
        isMd: width >= 768,
        isLg: width >= 1024,
        isXl: width >= 1280,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, dimensions];
}
