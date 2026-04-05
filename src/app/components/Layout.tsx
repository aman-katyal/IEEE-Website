import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

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
      <ScrollToTop />
      <Navigation />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
