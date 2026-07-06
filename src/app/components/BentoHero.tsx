import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { useHomePage, useCommittees } from "../../hooks/useSanityData";
import { MagneticButton } from "./MagneticButton";
import { Skeleton } from "boneyard-js/react";

// ─── CountUp animation hook ──────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start || !target) {
      if (start && target === 0) setCount(0);
      return;
    }
    
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  
  return count;
}

// ─── Stat Item (Component) ───────────────────────────────────────────
interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  prefix?: string;
}

function CyclingStat({ stats, isLight }: { stats: StatItem[]; isLight: boolean }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const currentStat = stats[index] || { value: 0, label: "Metric", suffix: "" };
  const count = useCountUp(Number(currentStat.value) || 0, 1500, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (stats.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % stats.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [stats]);

  return (
    <div
      ref={ref}
      className="glass-card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
        background: "rgba(0, 98, 155, 0.02)",
      }}
    >
      <div
        className="stat-number"
        style={{
          fontSize: "clamp(36px, 4vw, 48px)",
          fontWeight: 700,
          color: "var(--cyber-gold)",
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        {currentStat.prefix || ""}
        {count.toLocaleString()}
        {currentStat.suffix || ""}
      </div>
      <div
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "4px",
        }}
      >
        {currentStat.label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {currentStat.sublabel}
      </div>
    </div>
  );
}

// ─── Lab Rack Ticker Data ────────────────────────────────────────────
interface RackSlot {
  id: string;
  tag: string;
  indicator: string;
  title: string;
  displayTitle: string; // Pre-computed: title with parenthetical suffix stripped
  description: string;
  meeting: string;
  link: string;
}

const COMMITTEE_STATUS_METADATA: Record<string, { tag: string; indicator: string }> = {
  rov:                  { tag: "ROV",    indicator: "RUNNING" },
  csociety:             { tag: "CS",     indicator: "STABLE"  },
  aesc:                 { tag: "AESC",   indicator: "ACTIVE"  },
  "software-saturdays": { tag: "SWSAT",  indicator: "ONLINE"  },
  racing:               { tag: "RACING", indicator: "RUNNING" },
  mtts:                 { tag: "MTTS",   indicator: "ONLINE"  },
  embs:                 { tag: "EMBS",   indicator: "STABLE"  },
  eds:                  { tag: "EDS",    indicator: "ACTIVE"  },
  smc:                  { tag: "SMC",    indicator: "RUNNING" },
};

function makeDisplayTitle(title: string) {
  return title.replace(/\(.*\)/, "").trim();
}

export function BentoHero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data: homeData, loading: homeLoading } = useHomePage();
  const { committees, loading: committeesLoading } = useCommittees();

  const [hoveredSlot, setHoveredSlot] = useState<RackSlot | null>(null);

  const isLight = theme === "light";
  const loading = homeLoading || committeesLoading;

  // All content comes directly from Sanity — no hardcoded fallbacks
  const heroTitle    = homeData?.heroTitle    ?? null;
  const heroSubtitle = homeData?.heroSubtitle ?? null;
  const heroImage    = homeData?.heroImage    ?? null;
  const aboutContent = homeData?.aboutContent ?? null;
  const stats: StatItem[] = (homeData?.stats && homeData.stats.length > 0) ? homeData.stats : [];

  // Resolve committee slots from Sanity only
  const activeSlots: RackSlot[] = (committees && committees.length > 0)
    ? committees.map((c) => {
        const meta = COMMITTEE_STATUS_METADATA[c.id.toLowerCase()] ?? {
          tag: c.shortName,
          indicator: "ONLINE",
        };
        return {
          id: c.id,
          tag: meta.tag ?? c.shortName,
          indicator: c.status ?? meta.indicator,
          title: c.name,
          displayTitle: makeDisplayTitle(c.name),
          description: c.description ?? c.tagline ?? "",
          meeting: c.meetingSchedule ?? "Check Discord for schedule",
          link: `/committee/${c.id}`,
        };
      })
    : [];

  return (
    <section
      id="hero-bento"
      style={{
        position: "relative",
        background: "var(--boiler-black)",
        minHeight: "100vh",
        padding: "100px 0 64px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Graphic Grid */}
      <div
        className="ieee-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: isLight ? 0.3 : 0.25,
          zIndex: 1,
        }}
      />
      
      {/* Visual Ambient Glow Orbs */}
      <div
        className="electric-glow-orb animate-glow-pulse-no-x"
        style={{
          width: "600px",
          height: "600px",
          top: "10%",
          left: "-10%",
          background: isLight 
            ? "radial-gradient(circle, rgba(0, 98, 155, 0.05) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0, 98, 155, 0.15) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        className="electric-glow-orb animate-glow-pulse-no-x"
        style={{
          width: "500px",
          height: "500px",
          bottom: "10%",
          right: "-10%",
          background: isLight 
            ? "radial-gradient(circle, rgba(235, 211, 169, 0.03) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(235, 211, 169, 0.1) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
        }}
      >
        <Skeleton name="bento-hero" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
          <div className="bento-grid">
            
            {/* 1. Hero Block (3x2 span) */}
            <div
              className="glass-card hero-bento-tile"
              style={{
                padding: "clamp(24px, 5vw, 40px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                backgroundImage: heroImage
                  ? `linear-gradient(to right, rgba(10, 10, 12, 0.92) 0%, rgba(10, 10, 12, 0.55) 38%, rgba(10, 10, 12, 0.35) 58%, rgba(10, 10, 12, 0.88) 100%), linear-gradient(to bottom, rgba(10, 10, 12, 0.15) 0%, transparent 30%, transparent 65%, rgba(10, 10, 12, 0.75) 100%), url('${heroImage}')`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {heroTitle && (
                <h1
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "clamp(28px, 4.5vw, 46px)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    marginBottom: "16px",
                  }}
                >
                  {heroTitle.includes("innovation") ? (
                    <>
                      {heroTitle.split("innovation")[0]}
                      <span style={{ color: "var(--electric-blue)" }}>innovation</span>
                      {heroTitle.split("innovation")[1]}
                    </>
                  ) : heroTitle}
                </h1>
              )}
              
              {heroSubtitle && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "32px",
                  }}
                >
                  {heroSubtitle}
                </p>
              )}

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <MagneticButton
                  variant="primary"
                  onClick={() => navigate("/committees")}
                  style={{ width: "auto" }}
                >
                  Explore Committees
                </MagneticButton>
                <Link
                  to="/join"
                  className="btn-ghost"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                  }}
                >
                  Join Purdue IEEE
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* 2. Branch Telemetry Console (1x1 span) */}
            <div
              className="glass-card"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                fontFamily: "var(--font-mono)",
                background: "rgba(10, 10, 12, 0.4)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "var(--electric-blue)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  // Branch Telemetry
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>HQ Location:</span>
                    <span>EE 115 / EE 224</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Active Projects:</span>
                    <span>14 Teams</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Dues Rate:</span>
                    <span>$15 / semester</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Discord Hub:</span>
                    <span style={{ color: "var(--cyber-gold)" }}>1,200+ Members</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--glass-border)", paddingTop: "12px", marginTop: "12px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C853", animation: "pulse-dot 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                  Purdue West Lafayette
                </span>
              </div>
            </div>

            {/* 3. Core Stats (1x1 span) */}
            <CyclingStat stats={stats} isLight={isLight} />

            {/* 4. Lab Status Rack (2x2 span) */}
            <div
              className="glass-card pcb-bento-tile"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "rgba(0, 30, 60, 0.03)",
                borderColor: isLight ? "rgba(0, 90, 135, 0.15)" : "rgba(0, 98, 155, 0.2)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "var(--electric-blue)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  // Lab Status Rack
                </div>
                
                {/* Visual Server/Equipment Rack Layout */}
                <div
                  className="rack-slots-grid"
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {activeSlots.map((slot) => {
                    const isHovered = hoveredSlot?.id === slot.id;

                    // Color-code by indicator status
                    const statusColor =
                      slot.indicator === "RUNNING" ? "#4FC3F7" :
                      slot.indicator === "STABLE"  ? "#00C853" :
                      slot.indicator === "ACTIVE"  ? "#EBD3A9" :
                      slot.indicator === "ONLINE"  ? "#69F0AE" :
                                                     "#00C853";

                    return (
                      <div
                        key={slot.id}
                        onMouseEnter={() => setHoveredSlot(slot)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          border: `1px solid ${isHovered ? statusColor : "rgba(255,255,255,0.06)"}`,
                          borderLeft: `3px solid ${isHovered ? statusColor : "rgba(255,255,255,0.12)"}`,
                          background: isHovered
                            ? `rgba(${slot.indicator === "RUNNING" ? "79,195,247" : "0,200,83"},0.06)`
                            : "rgba(255,255,255,0.02)",
                          cursor: "pointer",
                          transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                          overflow: "hidden",
                          boxSizing: "border-box",
                        }}
                      >
                        {/* Pill tag badge */}
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          flexShrink: 0,
                          background: isHovered
                            ? `${statusColor}22`
                            : "rgba(0, 98, 155, 0.18)",
                          border: `1px solid ${isHovered ? statusColor : "rgba(0,98,155,0.4)"}`,
                          borderRadius: "4px",
                          padding: "2px 7px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: isHovered ? statusColor : "var(--electric-blue)",
                          whiteSpace: "nowrap",
                          transition: "all 0.18s ease",
                        }}>
                          {slot.tag}
                        </span>

                        {/* Committee Name */}
                        <span style={{
                          flex: 1,
                          minWidth: 0,
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: isHovered ? "var(--text-primary)" : "rgba(248,249,250,0.75)",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          letterSpacing: "0.01em",
                          transition: "color 0.18s ease",
                        }}>
                          {slot.displayTitle}
                        </span>

                        {/* Status indicator dot */}
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                          <div style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: statusColor,
                            boxShadow: `0 0 ${isHovered ? "8px" : "4px"} ${statusColor}`,
                            transition: "box-shadow 0.18s ease",
                            animation: "pulse-dot 2.5s ease-in-out infinite",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stateful Info Panel inside card */}
              <div
                style={{
                  background: isLight ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.2)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "4px",
                  padding: "16px",
                  minHeight: "90px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <AnimatePresence mode="wait">
                  {hoveredSlot ? (
                    <motion.div
                      key={hoveredSlot.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "var(--font-headline)",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--cyber-gold)",
                          }}
                        >
                          {hoveredSlot.title}
                        </h4>
                        <Link
                          to={hoveredSlot.link}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "2px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.55rem",
                            color: "var(--electric-blue)",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontWeight: 700,
                          }}
                        >
                          Go to Team
                          <ArrowUpRight size={10} />
                        </Link>
                      </div>

                      {/* Schedule info */}
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6rem",
                          color: "var(--electric-blue)",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                        }}
                      >
                        Schedule: {hoveredSlot.meeting}
                      </div>

                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.4,
                        }}
                      >
                        {hoveredSlot.description}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.08em",
                        color: "var(--text-muted)",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Hover over any status slot above to inspect the technical committee's active telemetry.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 5. About Us (2x2 span) */}
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
                  <h3
                    style={{
                      fontFamily: "var(--font-headline)",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.2,
                      marginBottom: "12px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Purdue's Largest Technical <span style={{ color: "var(--electric-blue)" }}>Student Organization</span>
                  </h3>
                  {aboutContent && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.55,
                        marginBottom: "20px",
                      }}
                    >
                      {aboutContent}
                    </p>
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

          </div>
        </Skeleton>
      </div>


    </section>
  );
}
