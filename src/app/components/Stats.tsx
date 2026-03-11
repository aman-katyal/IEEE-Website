import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 750, suffix: "+", label: "Active Members", sublabel: "Across all committees" },
  { value: 1903, suffix: "", label: "Founded", sublabel: "Legacy of innovation" },
  { value: 9, suffix: "", label: "Technical Committees", sublabel: "Specialized focus" },
  { value: 98, suffix: "%", label: "Placement Rate", sublabel: "Intern & full-time" },
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

function StatItem({ value, suffix, label, sublabel, delay }: {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  delay: number;
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
          background: "linear-gradient(to bottom, transparent, rgba(235,211,169,0.15), transparent)",
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
        {count}
        <span style={{ color: "#EBD3A9", fontSize: "0.6em" }}>{suffix}</span>
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#F8F9FA",
          marginBottom: "6px",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>

      {/* Sublabel */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "rgba(248,249,250,0.3)",
          textTransform: "uppercase",
        }}
      >
        {sublabel}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section
      id="research"
      style={{
        background: "#001E3C",
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
            "linear-gradient(90deg, transparent 0%, rgba(0,98,155,0.8) 30%, rgba(235,211,169,0.5) 50%, rgba(0,98,155,0.8) 70%, transparent 100%)",
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
            "linear-gradient(90deg, transparent 0%, rgba(0,98,155,0.5) 50%, transparent 100%)",
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
          background:
            "radial-gradient(ellipse, rgba(0,98,155,0.15) 0%, transparent 70%)",
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
            borderBottom: "1px solid rgba(235,211,169,0.08)",
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
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: "rgba(0,98,155,0.7)",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="ieee-grid-4">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}