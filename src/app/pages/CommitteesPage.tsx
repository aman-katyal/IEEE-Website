import { Committees } from "../components/committees/Committees";
import { CornerstoneCommittees } from "../components/committees/CornerstoneCommittees";
import { JoinCTA } from "../components/home/JoinCTA";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";

export function CommitteesPage() {
  const [viewMode, setViewMode] = useState<"technical" | "operations">("technical");
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Ensure we start at the top of the page on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 bg-[var(--boiler-black)] min-h-screen">
      <div className="max-w-[1280px] mx-auto pt-12 px-8 text-center relative z-10">
        <p className="section-eyebrow mb-4">
          // Purdue IEEE Committees
        </p>
        <h1 className="font-[family-name:var(--font-headline)] text-[clamp(36px,5vw,64px)] font-bold text-[var(--text-primary)] leading-[1.1] tracking-[-0.025em] mb-8">
          Our <span className="text-[var(--electric-blue)]">Teams</span>
        </h1>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-[rgba(128,128,128,0.05)] border border-[var(--glass-border)] rounded-full p-1 relative">
            <button
              onClick={() => setViewMode("technical")}
              className={`relative py-2.5 px-6 rounded-full font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.08em] border-none bg-transparent cursor-pointer transition-colors duration-200 z-[2] ${
                viewMode === "technical"
                  ? (isLight ? "text-[var(--background)]" : "text-[var(--boiler-black)]")
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
              Engineering
            </button>
            <button
              onClick={() => setViewMode("operations")}
              className={`relative py-2.5 px-6 rounded-full font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.08em] border-none bg-transparent cursor-pointer transition-colors duration-200 z-[2] ${
                viewMode === "operations"
                  ? (isLight ? "text-[var(--background)]" : "text-[var(--boiler-black)]")
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
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "technical" ? (
          <motion.div
            key="technical"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Committees />
          </motion.div>
        ) : (
          <motion.div
            key="operations"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CornerstoneCommittees />
          </motion.div>
        )}
      </AnimatePresence>

      <JoinCTA />
    </div>
  );
}
