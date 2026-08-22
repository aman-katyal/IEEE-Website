import { useEffect } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router";
import { AnimatePresence } from "motion/react";
import { ThemeProvider } from "next-themes";
import { enableVisualEditing } from "@sanity/visual-editing";
import { BackToTop } from "./components/shared/BackToTop";

import { ToastProvider } from "./components/ui/toast";
import { OfflineNotifier } from "./components/shared/OfflineNotifier";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { PreviewBanner } from "./components/shared/PreviewBanner";

export default function App() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Only enable visual editing if we're in an iframe or have a preview parameter
    const isIframe = window.self !== window.top;
    const isPreview = searchParams.has('preview');

    if (!(isIframe || isPreview)) return;

    const disable = enableVisualEditing({
      zIndex: 1000,
      onPublish: () => {
        window.location.reload();
      }
    } as any);

    return () => {
      disable();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <ToastProvider>
        <PreviewBanner />
        <ScrollToTop />
        <OfflineNotifier />
        <BackToTop />
        
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </ToastProvider>
    </ThemeProvider>
  );
}
