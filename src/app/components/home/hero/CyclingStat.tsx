import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useCountUp } from "../../../../hooks/useCountUp";

// ─── Stat Item Interface ─────────────────────────────────────────────
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  prefix?: string;
}

export interface CyclingStatProps {
  stats: StatItem[];
  isLight?: boolean;
}

export function CyclingStat({ stats }: CyclingStatProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentStat = stats[index] || { value: 0, label: "Metric", suffix: "" };
  const count = useCountUp(Number(currentStat.value) || 0, 1500, visible && !isPaused);

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
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsPaused(true);
      }
    }
  }, []);

  useEffect(() => {
    if (stats.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % stats.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [stats.length, isPaused]);

  return (
    <div
      ref={ref}
      className="glass-card"
      role="region"
      aria-label={`Branch statistic: ${currentStat.label}`}
      aria-live="polite"
      aria-atomic="true"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
        position: "relative",
        background: "rgba(0, 98, 155, 0.02)",
      }}
    >
      {stats.length > 1 && (
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? "Play stats animation" : "Pause stats animation"}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      )}
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
        {(() => {
          const isYear =
            (currentStat.value >= 1800 && currentStat.value <= 2100) ||
            /year|founded|est/i.test(`${currentStat.label || ""} ${currentStat.sublabel || ""}`);
          return isYear ? count.toString() : count.toLocaleString();
        })()}
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
