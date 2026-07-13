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
    <div style={{ paddingTop: "80px", background: "var(--boiler-black)", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 32px 0",
          textAlign: "center",
          position: "relative",
          zIndex: 10
        }}
      >
        <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
          // Purdue IEEE Committees
        </p>
        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            marginBottom: "32px",
          }}
        >
          Our <span style={{ color: "var(--electric-blue)" }}>Teams</span>
        </h1>

        {/* View Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{
            display: "flex",
            background: "rgba(128, 128, 128, 0.05)",
            border: "1px solid var(--glass-border)",
            borderRadius: "100px",
            padding: "4px",
            position: "relative",
          }}>
            <button
              onClick={() => setViewMode("technical")}
              style={{
                position: "relative",
                padding: "10px 24px",
                borderRadius: "100px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                border: "none",
                background: "transparent",
                color: viewMode === "technical"
                  ? (isLight ? "var(--background)" : "var(--boiler-black)")
                  : "var(--text-muted)",
                cursor: "pointer",
                transition: "color 0.2s ease",
                zIndex: 2
              }}
            >
              {viewMode === "technical" && (
                <motion.div
                  layoutId="viewModeIndicator"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--cyber-gold)",
                    borderRadius: "100px",
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              Engineering
            </button>
            <button
              onClick={() => setViewMode("operations")}
              style={{
                position: "relative",
                padding: "10px 24px",
                borderRadius: "100px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                border: "none",
                background: "transparent",
                color: viewMode === "operations"
                  ? (isLight ? "var(--background)" : "var(--boiler-black)")
                  : "var(--text-muted)",
                cursor: "pointer",
                transition: "color 0.2s ease",
                zIndex: 2
              }}
            >
              {viewMode === "operations" && (
                <motion.div
                  layoutId="viewModeIndicator"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--cyber-gold)",
                    borderRadius: "100px",
                    zIndex: -1
                  }}
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
