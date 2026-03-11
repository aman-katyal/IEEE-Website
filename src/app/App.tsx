import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CommitteePage } from "./pages/CommitteePage";
import { CommitteesPage } from "./pages/CommitteesPage";
import { OfficersPage } from "./pages/OfficersPage";
import { CalendarPage } from "./pages/CalendarPage";
import { JoinPage } from "./pages/JoinPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { ConstitutionPage } from "./pages/ConstitutionPage";
import { UXEffects } from "./components/UXEffects";
import { BackToTop } from "./components/BackToTop";
import { PageTransition } from "./components/PageTransition";

export default function App() {
  const location = useLocation();

  return (
    <>
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
            <Route path="/constitution" element={<PageTransition><ConstitutionPage /></PageTransition>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}
