import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { ThemeProvider } from "next-themes";
import { enableVisualEditing } from "@sanity/visual-editing";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CommitteePage } from "./pages/CommitteePage";
import { CommitteesPage } from "./pages/CommitteesPage";
import { OfficersPage } from "./pages/OfficersPage";
import { CalendarPage } from "./pages/CalendarPage";
import { JoinPage } from "./pages/JoinPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { PartnersPage } from "./pages/PartnersPage";
import { ConstitutionPage } from "./pages/ConstitutionPage";
import { UXEffects } from "./components/UXEffects";
import { BackToTop } from "./components/BackToTop";
import { PageTransition } from "./components/PageTransition";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Enable visual editing handshake when inside an iframe (Sanity Studio)
    console.log("Sanity Visual Editing: Initializing handshake...");
    const disable = enableVisualEditing({
      zIndex: 1000,
      onPublish: () => {
        console.log("Sanity Visual Editing: Content published");
        window.location.reload();
      }
    });
    
    if (window.self !== window.top) {
      console.log("Sanity Visual Editing: Detected iframe environment");
    }

    return () => {
      console.log("Sanity Visual Editing: Disabling handshake");
      disable();
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <UXEffects />
      <BackToTop />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutUsPage /></PageTransition>} />
            <Route path="/committees" element={<PageTransition><CommitteesPage /></PageTransition>} />
            <Route path="/committee/:id" element={<PageTransition><CommitteePage /></PageTransition>} />
            <Route path="/officers" element={<PageTransition><OfficersPage /></PageTransition>} />
            <Route path="/calendar" element={<PageTransition><CalendarPage /></PageTransition>} />
            <Route path="/join" element={<PageTransition><JoinPage /></PageTransition>} />
            <Route path="/partners" element={<PageTransition><PartnersPage /></PageTransition>} />
            <Route path="/constitution" element={<PageTransition><ConstitutionPage /></PageTransition>} />
            <Route path="*" element={<div style={{ color: 'white', padding: '100px' }}>404 - Page Not Found</div>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}
