import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Resets window scroll position to the top on every route change.
 * Place this once inside the Router tree in App.tsx or Layout.tsx.
 */
export function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
