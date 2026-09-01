import { Committees } from "../components/committees/Committees";
import { CornerstoneCommittees } from "../components/committees/CornerstoneCommittees";
import { JoinCTA } from "../components/home/JoinCTA";
import { useState, startTransition } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { usePageMeta } from "../../hooks/usePageMeta";

export function CommitteesPage() {
  usePageMeta({
    title: "Committees",
    description:
      "Explore Purdue IEEE technical committees: ROV, Racing, Aerial Robotics, Computer Society, EMBS, MTT-S, and Software Saturdays.",
  });

  const [viewMode, setViewMode] = useState<"technical" | "involvement" | "operations">(
    "technical",
  );
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleModeChange = (mode: "technical" | "involvement" | "operations") => {
    startTransition(() => {
      setViewMode(mode);
    });
  };


  return (
    <div className="pt-20 bg-[var(--boiler-black)] min-h-screen">
      <div className="max-w-[1280px] mx-auto pt-12 px-8 text-center relative z-10">
        <p className="section-eyebrow mb-4">// Purdue IEEE Committees</p>
        <h1 className="font-[family-name:var(--font-headline)] text-[clamp(36px,5vw,64px)] font-bold text-[var(--text-primary)] leading-[1.1] tracking-[-0.025em] mb-8">
          Our <span className="text-[var(--electric-blue)]">Committees</span>
        </h1>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div
            role="tablist"
            aria-label="Committee Categories"
            className="flex bg-[rgba(128,128,128,0.05)] border border-[var(--glass-border)] rounded-full p-1 relative flex-wrap sm:flex-nowrap gap-1"
            onKeyDown={(e) => {
              const tabs: Array<"technical" | "involvement" | "operations"> = ["technical", "involvement", "operations"];
              const currentIndex = tabs.indexOf(viewMode);
              if (e.key === "ArrowRight") {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabs.length;
                handleModeChange(tabs[nextIndex]);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                handleModeChange(tabs[prevIndex]);
              } else if (e.key === "Home") {
                e.preventDefault();
                handleModeChange(tabs[0]);
              } else if (e.key === "End") {
                e.preventDefault();
                handleModeChange(tabs[tabs.length - 1]);
              }
            }}
          >
            <button
              role="tab"
              aria-selected={viewMode === "technical"}
              tabIndex={viewMode === "technical" ? 0 : -1}
              onClick={() => handleModeChange("technical")}
              className={`relative py-2.5 px-6 rounded-full font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.08em] border-none bg-transparent cursor-pointer transition-colors duration-200 z-[2] ${
                viewMode === "technical"
                  ? isLight
                    ? "text-[var(--background)]"
                    : "text-[var(--boiler-black)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {viewMode === "technical" && (
                <motion.div
                  layoutId="viewModeIndicator"
                  className="absolute inset-0 bg-[var(--cyber-gold)] rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              Technical Committees
            </button>
            <button
              role="tab"
              aria-selected={viewMode === "involvement"}
              tabIndex={viewMode === "involvement" ? 0 : -1}
              onClick={() => handleModeChange("involvement")}
              className={`relative py-2.5 px-6 rounded-full font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.08em] border-none bg-transparent cursor-pointer transition-colors duration-200 z-[2] ${
                viewMode === "involvement"
                  ? isLight
                    ? "text-[var(--background)]"
                    : "text-[var(--boiler-black)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {viewMode === "involvement" && (
                <motion.div
                  layoutId="viewModeIndicator"
                  className="absolute inset-0 bg-[var(--cyber-gold)] rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              Involvement
            </button>
            <button
              role="tab"
              aria-selected={viewMode === "operations"}
              tabIndex={viewMode === "operations" ? 0 : -1}
              onClick={() => handleModeChange("operations")}
              className={`relative py-2.5 px-6 rounded-full font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.08em] border-none bg-transparent cursor-pointer transition-colors duration-200 z-[2] ${
                viewMode === "operations"
                  ? isLight
                    ? "text-[var(--background)]"
                    : "text-[var(--boiler-black)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {viewMode === "operations" && (
                <motion.div
                  layoutId="viewModeIndicator"
                  className="absolute inset-0 bg-[var(--cyber-gold)] rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              Operations
            </button>
          </div>
        </div>

        {/* Live announcement region for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {viewMode === "technical" && "Showing Technical Committees"}
          {viewMode === "involvement" && "Showing Involvement Committees"}
          {viewMode === "operations" && "Showing Operations Committees"}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "technical" && (
          <motion.div
            key="technical"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Committees />
          </motion.div>
        )}
        {viewMode === "involvement" && (
          <motion.div
            key="involvement"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CornerstoneCommittees filterId="involvement" />
          </motion.div>
        )}
        {viewMode === "operations" && (
          <motion.div
            key="operations"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CornerstoneCommittees filterId="operations" />
          </motion.div>
        )}
      </AnimatePresence>

      <JoinCTA />
    </div>
  );
}
