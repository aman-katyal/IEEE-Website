import { ArrowUpRight, Users, Trophy, Cpu, Globe, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "next-themes";
import { useCommittees } from "../../hooks/useSanityData";
import { Skeleton } from "./ui/skeleton";
import { MagneticWrapper } from "./ui/MagneticWrapper";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import type { Committee } from "../../data/committees/types";

function CommitteeCard({ c }: { c: Committee }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Use dynamic metrics or fallback to empty array
  const displayMetrics = c.metrics || [];

  return (
    <MagneticWrapper strength={0.05} className="w-full h-full">
      <Link
        to={`/committee/${c.id}`}
        className="block h-full no-underline"
      >
        <Card
          className="glass-card flex flex-col h-full overflow-hidden cursor-pointer border-none shadow-none hover-glow-blue hover-scale hover-border-blue transition-all duration-300"
        >
          {/* Image */}
          <div
            className="relative h-[180px] overflow-hidden"
          >
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-500 will-change-transform"
              style={{
                filter: isLight ? "brightness(0.9) saturate(1.1)" : "brightness(0.65) saturate(0.8)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)";
                (e.currentTarget as HTMLImageElement).style.filter = isLight ? "brightness(1) saturate(1.2)" : "brightness(0.8) saturate(0.9)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLImageElement).style.filter = isLight ? "brightness(0.9) saturate(1.1)" : "brightness(0.65) saturate(0.8)";
              }}
            />

            {/* Theme-aware overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: isLight
                  ? "linear-gradient(to bottom, transparent 50%, rgba(241,245,249,0.3) 100%)"
                  : "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%)",
              }}
            />

            {/* Status Badge */}
            <div
              className="status-badge absolute top-3 right-0 backdrop-blur-md"
              style={{
                background: c.statusBg,
                color: c.statusColor,
              }}
            >
              <span className="dot" />
              {c.status}
            </div>
          </div>

          <CardHeader className="p-6 pb-1">
            <h3
              className="font-headline text-[17px] font-bold text-[var(--text-primary)] leading-tight mb-1"
            >
              {c.shortName}
            </h3>
            <p
              className="font-mono text-[0.65rem] text-[var(--cyber-gold)] tracking-[0.1em] uppercase mb-3"
              style={{ opacity: isLight ? 1 : 0.8 }}
            >
              {c.tagline}
            </p>
          </CardHeader>

          <CardContent className="p-6 pt-0 flex-1 flex flex-col">
            <p
              className="font-body text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5 flex-1"
            >
              {c.description}
            </p>

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
                    className={`flex flex-col items-center gap-[3px] px-2 ${
                      i < displayMetrics.length - 1 ? "border-r border-[var(--glass-border)]" : ""
                    }`}
                  >
                    <span
                      className="font-mono text-[15px] font-semibold text-[var(--electric-blue)] leading-none"
                    >
                      {m.value}
                    </span>
                    <span
                      className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.12em] uppercase"
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags Row */}
            <div
              className="flex flex-wrap gap-1.5 mb-5"
            >
              {c.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tech-tag">
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex justify-between items-center">
            <span
              className="font-body text-[0.8rem] font-medium text-[var(--electric-blue)] tracking-[0.08em] uppercase flex items-center gap-1.5"
            >
              Learn More
              <ArrowUpRight size={14} />
            </span>

            <div
              className="w-1 h-1 rounded-full bg-[var(--cyber-gold)]"
              style={{ opacity: isLight ? 1 : 0.5 }}
            />
          </CardFooter>
        </Card>
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
      <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-secondary)" }}>
        Error loading committees: {error.message}
      </div>
    );
  }

  return (
    <section
      id="committees"
      style={{
        background: "var(--boiler-black)",
        padding: "48px 0 96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="electric-glow-orb"
        style={{
          width: "600px",
          height: "600px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: isLight ? 0 : 0.5,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "48px",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <p className="section-eyebrow" style={{ marginBottom: "12px" }}>
              // Project Committees
            </p>
            <h2
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Active{" "}
              <span style={{ color: "var(--cyber-gold)" }}>Engineering</span>{" "}
              Teams
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                opacity: isLight ? 1 : 0.8
              }}
            >
              sys.committees.count
            </div>
            {loading ? (
              <Skeleton style={{ height: "16px", width: "30px", background: "rgba(255,255,255,0.1)" }} />
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--electric-blue)",
                  letterSpacing: "0.1em",
                }}
              >
                = {committees.length}
              </div>
            )}
          </div>
        </div>

        <div className="ieee-grid-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="glass-card" style={{ height: "450px" }}>
                <Skeleton style={{ height: "180px", width: "100%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ padding: "24px" }}>
                  <Skeleton style={{ height: "24px", width: "60%", marginBottom: "12px", background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton style={{ height: "16px", width: "40%", marginBottom: "20px", background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton style={{ height: "80px", width: "100%", marginBottom: "24px", background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton style={{ height: "40px", width: "100%", background: "rgba(255,255,255,0.05)" }} />
                </div>
              </div>
            ))
          ) : (
            committees.map((c, index) => (
              <div 
                key={c.id} 
                className={`animate-fade-in-up opacity-0-init`}
                style={{ animationDelay: `${(index % 3) * 150}ms` }}
              >
                <CommitteeCard c={c} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
