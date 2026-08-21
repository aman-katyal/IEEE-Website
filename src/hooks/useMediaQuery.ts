import { useState, useEffect } from "react";

/**
 * Custom hook to track whether a CSS media query matches the current viewport/environment.
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(q).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else {
      // Fallback for older Safari
      mediaQueryList.addListener(listener);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
