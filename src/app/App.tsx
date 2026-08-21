import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { ThemeProvider } from "next-themes";
import { enableVisualEditing } from "@sanity/visual-editing";
import { BackToTop } from "./components/shared/BackToTop";

import { ToastProvider } from "./components/ui/toast";
import { OfflineNotifier } from "./components/shared/OfflineNotifier";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Only enable visual editing if we're in an iframe or have a preview parameter
    const isIframe = window.self !== window.top;
    const isPreview = new URLSearchParams(window.location.search).has('preview');

    if (isIframe || isPreview) {
      const disable = enableVisualEditing({
        zIndex: 1000,
        onPublish: () => {
          window.location.reload();
        }
      } as any);

      return () => {
        disable();
      };
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <ToastProvider>
        <OfflineNotifier />
        <BackToTop />
        
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </ToastProvider>
    </ThemeProvider>
  );
}
