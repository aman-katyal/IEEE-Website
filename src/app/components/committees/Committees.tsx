import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "next-themes";
import { useCommittees } from "../../../hooks/useSanityData";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";
import { Skeleton } from "../ui/skeleton";
import { MagneticWrapper } from "../ui/MagneticWrapper";
import type { Committee } from "../../../data/committees/types";
import { motion, AnimatePresence } from "motion/react";

function CommitteeCard({ c }: { c: Committee }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Use dynamic metrics or fallback to empty array
  const displayMetrics = c.metrics || [];

  return (
    <MagneticWrapper strength={0.05} className="w-full h-full">
      <Link
        to={`/committee/${c.id}`}
        className="no-underline text-inherit block h-full"
      >
        <div className="glass-card hover-glow-blue hover-scale hover-border-blue group relative flex flex-col overflow-hidden cursor-pointer h-full">
          {/* Image */}
          <div className="relative h-[180px] overflow-hidden">
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-500 will-change-transform group-hover:scale-105 ${
                isLight
                  ? "brightness-90 saturate-110 group-hover:brightness-100 group-hover:saturate-120"
                  : "brightness-75 saturate-80 group-hover:brightness-90 group-hover:saturate-90"
              }`}
            />

            {/* Theme-aware overlay */}
            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-gradient-to-b from-transparent via-transparent to-slate-100/30"
                  : "bg-gradient-to-b from-transparent via-transparent to-black/80"
              }`}
            />

            {/* Non-Active Status Badge */}
            {c.status && c.status.toLowerCase() !== "active" && (
              <div
                className="status-badge absolute top-3 right-3"
                style={{
                  background: c.statusBg || "rgba(255, 0, 0, 0.2)",
                  color: c.statusColor || "#ff5555",
                }}
              >
                <span className="dot" />
                {c.status}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-[family-name:var(--font-headline)] text-[17px] font-bold text-[var(--text-primary)] mb-1 leading-snug">
              {c.shortName}
            </h3>
            <p className="font-[family-name:var(--font-mono)] text-[0.65rem] text-[var(--cyber-gold)] tracking-[0.1em] uppercase mb-3.5 opacity-90">
              {c.tagline}
            </p>

            <div className="font-[family-name:var(--font-body)] text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5 flex-1 whitespace-pre-wrap line-clamp-3">
              {c.description}
            </div>

            {/* Dynamic Metrics Row */}
            {displayMetrics.length > 0 && (
              <div
                className="grid gap-0 border-y border-[var(--glass-border)] mb-5 py-3"
                style={{
                  gridTemplateColumns: `repeat(${displayMetrics.length}, 1fr)`,
                }}
              >
                {displayMetrics.map((m, i) => (
                  <div
                    key={m.label}
                    className={`flex flex-col items-center gap-0.5 px-2 ${
                      i < displayMetrics.length - 1
                        ? "border-r border-[var(--glass-border)]"
                        : ""
                    }`}
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-[var(--electric-blue)] leading-none">
                      {m.value}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[0.58rem] text-[var(--text-muted)] tracking-[0.12em] uppercase">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags Row */}
            <div className="flex gap-1.5 flex-wrap mb-5">
              {c.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="tech-tag text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center mt-auto pt-3">
              <span className="learn-more-link font-[family-name:var(--font-body)] text-[0.85rem] font-semibold text-[var(--electric-blue)] tracking-[0.05em] uppercase flex items-center gap-2 transition-all duration-300">
                Explore Committee
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </span>

              <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-gold)] opacity-60 shadow-[0_0_10px_var(--cyber-gold)]" />
            </div>
          </div>

          {/* Hover overlay effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500 bg-gradient-to-tr from-[var(--electric-blue)] to-transparent" />
        </div>
      </Link>
    </MagneticWrapper>
  );
}

export function Committees() {
  const { committees, loading, error } = useCommittees();
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (error) {
    return (
      <div className="py-12 text-center text-[var(--text-secondary)]">
        Error loading committees: {error.message}
      </div>
    );
  }

  return (
    <section
      id="committees"
      className="bg-[var(--boiler-black)] pt-4 pb-24 relative overflow-hidden"
    >
      <div className="electric-glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 dark:opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase">
            <span className="text-[var(--text-muted)] opacity-80">
              Committees:
            </span>
            {loading ? (
              <Skeleton className="h-4 w-6 bg-white/10" />
            ) : (
              <span className="text-[var(--electric-blue)] font-semibold">
                {committees.length}
              </span>
            )}
          </div>
        </div>

        <BoneyardSkeleton
          name="committees-grid"
          loading={loading}
          color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {committees.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <CommitteeCard c={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </BoneyardSkeleton>
      </div>
    </section>
  );
}
