import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Cpu, Radio, ShieldAlert, Cpu as SensorIcon, ArrowUpRight } from "lucide-react";
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
function CyclingStat({ stats, isLight }: { stats: any[]; isLight: boolean }) {
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
  status: string;
  load: string;
  indicator: string;
  title: string;
  description: string;
  meeting: string;
  link: string;
}

const RACK_SLOTS: RackSlot[] = [
  {
    id: "rov",
    tag: "ROV-01",
    status: "THRUSTER_PID_LKD",
    load: "96%",
    indicator: "RUNNING",
    title: "Remotely Operated Vehicles (ROV)",
    description: "Designs and pilots autonomous underwater vehicles (AUVs) for marine exploration and international MATE competitions.",
    meeting: "Tuesdays 7:00 PM in Lab B",
    link: "/committee/rov"
  },
  {
    id: "cs",
    tag: "CS-02",
    status: "PORTAL_API_OK",
    load: "92%",
    indicator: "STABLE",
    title: "IEEE Computer Society",
    description: "Builds high-performance web systems, custom API integrations, software tools, and hosts coding hackathons.",
    meeting: "Wednesdays 6:00 PM in EE 224",
    link: "/committee/csociety"
  },
  {
    id: "aesc",
    tag: "AESC-03",
    status: "AVIONICS_TX_OK",
    load: "88%",
    indicator: "ACTIVE",
    title: "Aerial Robotics & Solar (AESC)",
    description: "Engineers solar tracking systems, heavy-lift flight frames, telemetry systems, and remote energy collection arrays.",
    meeting: "Thursdays 6:30 PM in Lab C",
    link: "/committee/aesc"
  },
  {
    id: "swsat",
    tag: "SWSAT-04",
    status: "BOOTCAMP_READY",
    load: "100%",
    indicator: "ONLINE",
    title: "Software Saturdays",
    description: "Teaches introductory web development, Git flow, and software engineering foundations to students of all majors.",
    meeting: "Saturdays 10:00 AM in EE 129",
    link: "/committee/csociety"
  }
];

const FALLBACK_STATS = [
  { value: 750, suffix: "+", label: "Active Members", sublabel: "Across all disciplines" },
  { value: 11, suffix: "", label: "Technical Teams", sublabel: "Project committees" },
  { value: 1903, suffix: "", label: "Established", sublabel: "Legacy of engineering" },
  { value: 50000, prefix: "$", suffix: "", label: "Raised Annually", sublabel: "Corporate funding" },
];

export function BentoHero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data: homeData, loading: homeLoading } = useHomePage();
  const { committees, loading: committeesLoading } = useCommittees();
  
  const [hoveredSlot, setHoveredSlot] = useState<RackSlot | null>(null);
  
  const isLight = theme === "light";
  const loading = homeLoading || committeesLoading;

  const heroTitle = homeData?.heroTitle || "Fostering technological innovation and excellence for the benefit of humanity.";
  const heroSubtitle = homeData?.heroSubtitle || "— IEEE Mission Statement";
  const sysUptime = homeData?.sysUptime || "ACTIVE";
  const semester = homeData?.semester || "SP_2026";
  const stats = (homeData?.stats && homeData.stats.length > 0) ? homeData.stats : FALLBACK_STATS;

  const aboutContent = homeData?.aboutContent || "Purdue IEEE is the university's largest technical organization. We engineer drones, design radio transmitters, program intelligent robots, and lead hands-on student projects.";

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
                background: "rgba(10, 10, 12, 0.2)",
              }}
            >
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
                    <span style={{ color: "var(--electric-blue)" }}>
                      innovation
                    </span>
                    {heroTitle.split("innovation")[1]}
                  </>
                ) : heroTitle}
              </h1>
              
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

            {/* 2. System Telemetry Console (1x1 span) */}
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
                  // System telemetry
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Uptime:</span>
                    <span style={{ color: sysUptime === "ACTIVE" ? "#00C853" : "#FF5252", fontWeight: 700 }}>
                      {sysUptime}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Term:</span>
                    <span>{semester.replace("_", " ")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Socket:</span>
                    <span>312_ONLINE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Telemetry:</span>
                    <span>REST_API_OK</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--glass-border)", paddingTop: "12px", marginTop: "12px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C853", animation: "pulse-dot 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                  Live Core Link
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
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  {RACK_SLOTS.map((slot) => {
                    const isHovered = hoveredSlot?.id === slot.id;
                    return (
                      <div
                        key={slot.id}
                        onMouseEnter={() => setHoveredSlot(slot)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          border: `1px solid ${isHovered ? "var(--cyber-gold)" : "var(--glass-border)"}`,
                          borderRadius: "4px",
                          background: isHovered ? "rgba(0, 98, 155, 0.08)" : "rgba(10, 10, 12, 0.2)",
                          cursor: "pointer",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.7rem",
                        }}
                      >
                        {/* Tag identifier */}
                        <span style={{ color: isHovered ? "var(--cyber-gold)" : "var(--electric-blue)", fontWeight: 700 }}>
                          [{slot.tag}]
                        </span>
                        
                        {/* Status ticker */}
                        <span style={{ color: "var(--text-secondary)", flex: 1, paddingLeft: "16px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {slot.status}
                        </span>
                        
                        {/* Load bar */}
                        <span className="hidden sm:inline" style={{ color: "var(--text-muted)", marginRight: "16px" }}>
                          ||||| {slot.load}
                        </span>

                        {/* Indicator Status Light */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isHovered ? "var(--cyber-gold)" : "#00C853", boxShadow: isHovered ? "0 0 6px var(--cyber-gold)" : "0 0 6px #00C853" }} />
                          <span style={{ fontSize: "0.6rem", color: "var(--text-primary)" }}>
                            {slot.indicator}
                          </span>
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
                  minHeight: "110px",
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
              className="glass-card"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "rgba(10, 10, 12, 0.2)",
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
                  // Who we are
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                    marginBottom: "16px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Purdue's Largest Technical <span style={{ color: "var(--electric-blue)" }}>Student Organization</span>
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  {aboutContent}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
        </Skeleton>
      </div>

      <style>{`
        /* Bento Grid Layout Setup */
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          width: 100%;
        }

        /* Desktop specific grids */
        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 230px;
          }
          .hero-bento-tile {
            grid-column: span 3;
            grid-row: span 2;
          }
          .pcb-bento-tile {
            grid-column: span 2;
            grid-row: span 2;
          }
        }

        /* pulse dot animation fallback keyframe in case it is not globally present */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
