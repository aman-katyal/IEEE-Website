import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { ThemeProvider } from "next-themes";
import { enableVisualEditing } from "@sanity/visual-editing";
import { BackToTop } from "./components/shared/BackToTop";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Only enable visual editing if we're in an iframe or have a preview parameter
    const isIframe = window.self !== window.top;
    const isPreview = new URLSearchParams(window.location.search).has('preview');

    if (isIframe || isPreview) {
      console.log("Sanity Visual Editing: Initializing handshake...");
      const disable = enableVisualEditing({
        zIndex: 1000,
        onPublish: () => {
          console.log("Sanity Visual Editing: Content published");
          window.location.reload();
        }
      } as any);

      return () => {
        console.log("Sanity Visual Editing: Disabling handshake");
        disable();
      };
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <BackToTop />
      
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </ThemeProvider>
  );
}
