import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const stats = [
  { value: 11, suffix: "", label: "Committees", sublabel: "Technical & support" },
  { value: 1903, suffix: "", label: "Founded", sublabel: "Legacy of innovation" },
  { value: 750, suffix: "+", label: "Members", sublabel: "Across all disciplines" },
  { value: 50000, suffix: "", prefix: "$", label: "Raised Annually", sublabel: "Project funding" },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
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

function StatItem({ value, suffix, prefix = "", label, sublabel, delay, isLight }: {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  delay: number;
  isLight: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "40px 24px",
        position: "relative",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Left border (only for items 2-4) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          height: "60%",
          width: "1px",
          background: "linear-gradient(to bottom, transparent, var(--glass-border), transparent)",
        }}
      />

      {/* Value */}
      <div
        className="stat-number"
        style={{
          fontSize: "clamp(48px, 6vw, 72px)",
          marginBottom: "6px",
        }}
      >
        <span style={{ color: "var(--cyber-gold)", fontSize: "0.6em" }}>{prefix}</span>
        {label === "Founded" ? count : count.toLocaleString()}
        <span style={{ color: "var(--cyber-gold)", fontSize: "0.6em" }}>{suffix}</span>
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "6px",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>

      {/* Sublabel */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          opacity: isLight ? 1 : 0.8
        }}
      >
        {sublabel}
      </div>
    </div>
  );
}

export function Stats() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      id="research"
      style={{
        background: "var(--boiler-black)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glowing top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, var(--electric-blue) 30%, var(--cyber-gold) 50%, var(--electric-blue) 70%, transparent 100%)",
          opacity: isLight ? 0.2 : 0.5
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, var(--electric-blue) 50%, transparent 100%)",
          opacity: isLight ? 0.15 : 0.3
        }}
      />

      {/* Background glow */}
      <div
        className="electric-glow-orb"
        style={{
          width: "800px",
          height: "300px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: isLight
            ? "radial-gradient(ellipse, rgba(0,98,155,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(0,98,155,0.15) 0%, transparent 70%)",
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
        {/* Mono header line */}
        <div
          style={{
            borderBottom: "1px solid var(--glass-border)",
            padding: "24px 0",
            display: "flex",
            gap: "32px",
            alignItems: "center",
            overflowX: "auto",
          }}
        >
          {[
            "sys.uptime = ACTIVE",
            "semester = SP_2026",
            "members.online = 312",
            "competitions.upcoming = 4",
          ].map((item) => (
            <span
              key={item}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                opacity: isLight ? 1 : 0.7
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="ieee-grid-4">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} delay={i * 100} isLight={isLight} />
          ))}
        </div>
      </div>
    </section>
  );
}
