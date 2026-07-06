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

// ─── PCB Interactive Modules Data ────────────────────────────────────
interface PCBModule {
  id: string;
  title: string;
  icon: any;
  committee: string;
  description: string;
  link: string;
}

const PCB_MODULES: Record<string, PCBModule> = {
  mcu: {
    id: "mcu",
    title: "Microcontroller Unit (MCU)",
    icon: Cpu,
    committee: "Computer Society & Software Saturdays",
    description: "Designs central computational systems, high-speed software architectures, and automated testing rigs.",
    link: "/committee/csociety"
  },
  rf: {
    id: "rf",
    title: "RF & Transceiver Array",
    icon: Radio,
    committee: "MTT-S (Microwave Theory)",
    description: "Develops wireless systems, microwave communication layers, and antenna circuitry for high-speed tracking.",
    link: "/committee/mtts"
  },
  power: {
    id: "power",
    title: "Power Distribution Network",
    icon: ShieldAlert,
    committee: "AESC (Aerial Robotics / Power)",
    description: "Engineers solar arrays, battery regulation safety blocks, and remote power telemetry grids.",
    link: "/committee/aesc"
  },
  sensors: {
    id: "sensors",
    title: "Sensor Fusion Array",
    icon: SensorIcon,
    committee: "ROV (Underwater Robotics)",
    description: "Combines IMU, depth, and hydrophone vectors into precise PID thruster velocity controllers.",
    link: "/committee/rov"
  }
};

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
  
  const [hoveredModule, setHoveredModule] = useState<PCBModule | null>(null);
  
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

            {/* 4. Interactive PCB Schematic (2x2 span) */}
            <div
              className="glass-card pcb-bento-tile"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "rgba(0, 30, 60, 0.05)",
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
                  // Interactive Schematic
                </div>
                
                {/* SVG Blueprint Board */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    marginBottom: "20px",
                  }}
                >
                  <svg
                    viewBox="0 0 320 180"
                    width="100%"
                    height="100%"
                    style={{
                      maxHeight: "150px",
                      overflow: "visible",
                    }}
                  >
                    {/* PCB Outlines */}
                    <rect
                      x="5"
                      y="5"
                      width="310"
                      height="170"
                      rx="8"
                      fill="none"
                      stroke={isLight ? "rgba(0,90,135,0.15)" : "rgba(255,255,255,0.06)"}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="10"
                      y="10"
                      width="300"
                      height="160"
                      rx="6"
                      fill="none"
                      stroke={isLight ? "rgba(0,90,135,0.2)" : "rgba(0,98,155,0.15)"}
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />

                    {/* Corner Mounting Holes */}
                    {[
                      { cx: 16, cy: 16 },
                      { cx: 304, cy: 16 },
                      { cx: 16, cy: 154 },
                      { cx: 304, cy: 154 }
                    ].map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.cx}
                        cy={pt.cy}
                        r="4"
                        fill="none"
                        stroke={isLight ? "rgba(0,90,135,0.3)" : "rgba(0,98,155,0.4)"}
                        strokeWidth="1"
                      />
                    ))}

                    {/* PCB Schematic Traces (Lines) */}
                    <path
                      d="M 50 90 L 120 90 M 120 90 L 120 40 M 120 90 L 120 140 M 175 90 L 250 90 M 250 90 L 250 120 M 140 115 L 140 140"
                      fill="none"
                      stroke={isLight ? "rgba(0,90,135,0.15)" : "rgba(0,98,155,0.25)"}
                      strokeWidth="1"
                    />

                    {/* MCU module hover path trace */}
                    <path
                      d="M 120 90 L 140 90"
                      fill="none"
                      stroke={hoveredModule?.id === "mcu" ? "var(--cyber-gold)" : (isLight ? "rgba(0,90,135,0.2)" : "rgba(0,98,155,0.3)")}
                      strokeWidth="1.5"
                    />

                    {/* Module 1: MCU Chip */}
                    <g
                      onMouseEnter={() => setHoveredModule(PCB_MODULES.mcu)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect
                        x="115"
                        y="65"
                        width="50"
                        height="50"
                        rx="4"
                        fill={hoveredModule?.id === "mcu" ? "rgba(0, 98, 155, 0.15)" : "rgba(128,128,128,0.05)"}
                        stroke={hoveredModule?.id === "mcu" ? "var(--cyber-gold)" : "var(--electric-blue)"}
                        strokeWidth={hoveredModule?.id === "mcu" ? "1.5" : "1"}
                        style={{ transition: "all 0.3s ease" }}
                      />
                      <text
                        x="140"
                        y="94"
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "7px", fontWeight: 700, pointerEvents: "none" }}
                      >
                        MCU
                      </text>
                      {/* Chip Pins */}
                      {[-8, -4, 0, 4, 8].map((offset) => (
                        <g key={offset} style={{ pointerEvents: "none" }}>
                          <line x1="110" y1={90 + offset} x2="115" y2={90 + offset} stroke="var(--electric-blue)" strokeWidth="0.8" />
                          <line x1="165" y1={90 + offset} x2="170" y2={90 + offset} stroke="var(--electric-blue)" strokeWidth="0.8" />
                          <line x1={140 + offset} y1="60" x2={140 + offset} y2="65" stroke="var(--electric-blue)" strokeWidth="0.8" />
                          <line x1={140 + offset} y1="115" x2={140 + offset} y2="120" stroke="var(--electric-blue)" strokeWidth="0.8" />
                        </g>
                      ))}
                    </g>

                    {/* Module 2: RF Transceiver */}
                    <g
                      onMouseEnter={() => setHoveredModule(PCB_MODULES.rf)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect
                        x="230"
                        y="20"
                        width="40"
                        height="40"
                        rx="2"
                        fill={hoveredModule?.id === "rf" ? "rgba(0, 98, 155, 0.15)" : "rgba(128,128,128,0.05)"}
                        stroke={hoveredModule?.id === "rf" ? "var(--cyber-gold)" : "var(--electric-blue)"}
                        strokeWidth={hoveredModule?.id === "rf" ? "1.5" : "1"}
                        style={{ transition: "all 0.3s ease" }}
                      />
                      <text
                        x="250"
                        y="44"
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "6.5px", pointerEvents: "none" }}
                      >
                        RF_ARR
                      </text>
                      {/* Antenna trace lines */}
                      <path d="M 270 30 Q 285 20 285 10 T 300 0" fill="none" stroke="var(--electric-blue)" strokeWidth="0.8" />
                    </g>

                    {/* Module 3: Power Distribution block */}
                    <g
                      onMouseEnter={() => setHoveredModule(PCB_MODULES.power)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect
                        x="30"
                        y="100"
                        width="45"
                        height="40"
                        rx="2"
                        fill={hoveredModule?.id === "power" ? "rgba(0, 98, 155, 0.15)" : "rgba(128,128,128,0.05)"}
                        stroke={hoveredModule?.id === "power" ? "var(--cyber-gold)" : "var(--electric-blue)"}
                        strokeWidth={hoveredModule?.id === "power" ? "1.5" : "1"}
                        style={{ transition: "all 0.3s ease" }}
                      />
                      <text
                        x="52.5"
                        y="124"
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "6.5px", pointerEvents: "none" }}
                      >
                        PWR_MNG
                      </text>
                      <line x1="20" y1="120" x2="30" y2="120" stroke="var(--electric-blue)" strokeWidth="0.8" />
                    </g>

                    {/* Module 4: Sensor Array */}
                    <g
                      onMouseEnter={() => setHoveredModule(PCB_MODULES.sensors)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect
                        x="230"
                        y="105"
                        width="40"
                        height="40"
                        rx="2"
                        fill={hoveredModule?.id === "sensors" ? "rgba(0, 98, 155, 0.15)" : "rgba(128,128,128,0.05)"}
                        stroke={hoveredModule?.id === "sensors" ? "var(--cyber-gold)" : "var(--electric-blue)"}
                        strokeWidth={hoveredModule?.id === "sensors" ? "1.5" : "1"}
                        style={{ transition: "all 0.3s ease" }}
                      />
                      <text
                        x="250"
                        y="129"
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "6.5px", pointerEvents: "none" }}
                      >
                        SEN_FUS
                      </text>
                      <circle cx="250" cy="115" r="2" fill="none" stroke="var(--electric-blue)" strokeWidth="0.8" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Stateful Info Panel inside card */}
              <div
                style={{
                  background: isLight ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.2)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "4px",
                  padding: "16px",
                  minHeight: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <AnimatePresence mode="wait">
                  {hoveredModule ? (
                    <motion.div
                      key={hoveredModule.id}
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
                          {hoveredModule.title}
                        </h4>
                        <Link
                          to={hoveredModule.link}
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
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.4,
                        }}
                      >
                        {hoveredModule.description}
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
                      Hover over any PCB module above to inspect its corresponding technical committee.
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
