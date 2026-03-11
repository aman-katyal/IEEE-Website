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
        background: "#000000",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: "#F8F9FA",
        overflowX: "hidden",
      }}
    >
      <ScrollToTop />
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}
