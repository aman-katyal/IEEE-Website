import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";

/** Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <div
      style={{
        background: "var(--boiler-black)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--text-primary)",
        overflowX: "hidden",
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--electric-blue)] focus:text-white focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--cyber-gold)]"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Navigation />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}
