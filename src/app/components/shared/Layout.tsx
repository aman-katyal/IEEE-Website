import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { ScrollToTop } from "./ScrollToTop";
import { SkipLink } from "./SkipLink";

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
      <SkipLink />
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
