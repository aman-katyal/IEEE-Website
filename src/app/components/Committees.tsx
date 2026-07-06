import { ArrowUpRight, Users, Trophy, Cpu, Globe, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "next-themes";
import { useCommittees } from "../../hooks/useSanityData";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";
import { Skeleton } from "./ui/skeleton";
import { MagneticWrapper } from "./ui/MagneticWrapper";
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
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div
          className="glass-card hover-glow-blue hover-scale hover-border-blue group relative"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            cursor: "pointer",
            height: "100%",
          }}
        >
        {/* Image */}
        <div
          style={{
            position: "relative",
            height: "180px",
            overflow: "hidden",
          }}
        >
          <img
            src={c.image}
            alt={c.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: isLight ? "brightness(0.9) saturate(1.1)" : "brightness(0.65) saturate(0.8)",
              transition: "transform 0.5s ease, filter 0.4s ease",
              willChange: "transform, filter",
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
            style={{
              position: "absolute",
              inset: 0,
              background: isLight
                ? "linear-gradient(to bottom, transparent 50%, rgba(241,245,249,0.3) 100%)"
                : "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%)",
            }}
          />

          {/* Status Badge */}
          <div
            className="status-badge"
            style={{
              position: "absolute",
              top: "12px",
              right: "0",
              background: c.statusBg,
              color: c.statusColor,
              backdropFilter: "blur(6px)",
            }}
          >
            <span className="dot" />
            {c.status}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "4px",
              lineHeight: 1.3,
            }}
          >
            {c.shortName}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--cyber-gold)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "14px",
              opacity: isLight ? 1 : 0.8
            }}
          >
            {c.tagline}
          </p>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              marginBottom: "20px",
              flex: 1,
            }}
          >
            {c.description}
          </p>

          {/* Dynamic Metrics Row */}
          {displayMetrics.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${displayMetrics.length}, 1fr)`,
                gap: "0",
                borderTop: "1px solid var(--glass-border)",
                borderBottom: "1px solid var(--glass-border)",
                marginBottom: "20px",
                padding: "12px 0",
              }}
            >
              {displayMetrics.map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    borderRight: i < displayMetrics.length - 1 ? "1px solid var(--glass-border)" : "none",
                    padding: "0 8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--electric-blue)",
                      lineHeight: 1,
                    }}
                  >
                    {m.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.58rem",
                      color: "var(--text-muted)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tags Row */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {c.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto",
              paddingTop: "12px"
            }}
          >
            <span
              className="learn-more-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--electric-blue)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "gap 0.3s ease, color 0.3s ease"
              }}
            >
              Explore Committee
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>

            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--cyber-gold)",
                opacity: isLight ? 1 : 0.5,
                boxShadow: isLight ? "none" : "0 0 10px var(--cyber-gold)"
              }}
            />
          </div>
        </div>
        
        {/* Hover overlay effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500"
          style={{ 
            background: "linear-gradient(45deg, var(--electric-blue), transparent)" 
          }} 
        />
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

        <BoneyardSkeleton name="committees-grid" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
          <div className="ieee-grid-3">
            {committees.map((c, index) => (
              <div 
                key={c.id} 
                className={`animate-fade-in-up opacity-0-init`}
                style={{ animationDelay: `${(index % 3) * 150}ms` }}
              >
                <CommitteeCard c={c} />
              </div>
            ))}
          </div>
        </BoneyardSkeleton>
      </div>
    </section>
  );
}
