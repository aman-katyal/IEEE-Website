import { useState, useEffect } from "react";

/**
 * Custom hook that listens to the `prefers-reduced-motion` media query.
 * Returns true if the user has requested the system to minimize non-essential motion.
 */
interface LegacyMediaQueryList {
  addListener(listener: (event: MediaQueryListEvent) => void): void;
  removeListener(listener: (event: MediaQueryListEvent) => void): void;
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => {
      if (typeof window === "undefined" || !window.matchMedia) return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQueryList.matches);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
      return () => mediaQueryList.removeEventListener("change", listener);
    } else {
      // Legacy browsers
      const legacyMql = mediaQueryList as unknown as LegacyMediaQueryList;
      if (legacyMql.addListener) {
        legacyMql.addListener(listener);
        return () => legacyMql.removeListener(listener);
      }
    }
  }, []);

  return prefersReducedMotion;
}
