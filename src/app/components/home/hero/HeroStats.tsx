import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Building2, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AlumniCompany } from "../../../../data/sanity-types";

export interface WhereEngineersGoCardProps {
  companies?: AlumniCompany[];
}

export function BranchTelemetryCard(props: WhereEngineersGoCardProps) {
  const { companies } = props;

  const activeCompanies = companies && companies.length > 0 ? companies : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeCompanies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeCompanies.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [activeCompanies.length]);

  if (activeCompanies.length === 0) {
    return null;
  }

  const currentCompany = activeCompanies[currentIndex] || activeCompanies[0];

  return (
    <div
      className="glass-card group hover:border-sky-500/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
      style={{
        padding: "20px",
        fontFamily: "var(--font-mono)",
        background: "rgba(10, 10, 12, 0.45)",
      }}
      data-testid="where-engineers-go-card"
    >
      {/* Top ambient highlight beam */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/50 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header telemetry badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "var(--electric-blue)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // Where Our Engineers Go
            </span>
          </div>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono border border-sky-500/20">
            <span>{currentIndex + 1} / {activeCompanies.length}</span>
          </span>
        </div>

        {/* Single Company Vertical Ticker Area */}
        <div className="relative h-[72px] my-2 overflow-hidden flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCompany.name + currentIndex}
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-inner"
            >
              {/* Company Logo Badge */}
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                {currentCompany.domain ? (
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${currentCompany.domain}&sz=64`}
                    alt=""
                    className="w-5 h-5 rounded-sm object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Building2 className="w-4 h-4 text-sky-400" />
                )}
              </div>

              {/* Company Name & Focus */}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-100 truncate tracking-tight">
                  {currentCompany.name}
                </div>
                {currentCompany.roleOrField && (
                  <div className="text-[11px] font-mono text-sky-300 truncate mt-0.5">
                    {currentCompany.roleOrField}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <Link
          to="/committees"
          className="px-2.5 py-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-sky-200 text-xs font-semibold transition-all flex items-center gap-1.5"
          title="Explore Technical Committees"
        >
          <span>Join a Project</span>
        </Link>

        <Link
          to="/committees"
          className="text-xs text-slate-300 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
          style={{ color: "var(--cyber-gold)" }}
        >
          <span>9 Committees</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}

export interface HeroAboutCardProps {
  aboutTitle?: string | null;
  aboutContent?: string | null;
}

export function HeroAboutCard({ aboutTitle, aboutContent }: HeroAboutCardProps) {
  return (
    <div
      className="glass-card about-bento-tile"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "rgba(10, 10, 12, 0.2)",
      }}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "var(--electric-blue)",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            // Who we are
          </div>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(16px, 2.5vw, 20px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              marginBottom: "12px",
              letterSpacing: "-0.01em",
            }}
          >
            {aboutTitle && (aboutTitle.includes("Student Organization") ? (
              <>
                {aboutTitle.split("Student Organization")[0]}
                <span style={{ color: "var(--electric-blue)" }}>Student Organization</span>
                {aboutTitle.split("Student Organization")[1]}
              </>
            ) : aboutTitle)}
          </h2>
          {aboutContent && (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                marginBottom: "20px",
                whiteSpace: "pre-wrap",
              }}
            >
              {aboutContent}
            </div>
          )}
        </div>
        <div>
          <Link
            to="/about"
            className="btn-gold hover-glow-gold"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              padding: "8px 18px",
              fontSize: "0.75rem",
            }}
          >
            Read Our Heritage
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
