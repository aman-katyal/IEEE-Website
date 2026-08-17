import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export interface BranchTelemetryCardProps {
  hqLocation?: string | null;
  committeesCount?: number;
  discordMembers?: string | null;
  campusLocation?: string | null;
}

export function BranchTelemetryCard({
  hqLocation,
  committeesCount,
  discordMembers,
  campusLocation,
}: BranchTelemetryCardProps) {
  return (
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
          // Branch Overview
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
          {hqLocation && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>HQ Location:</span>
              <span>{hqLocation}</span>
            </div>
          )}
          {typeof committeesCount === "number" && committeesCount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>Active Projects:</span>
              <span>{committeesCount} Committees</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>Membership:</span>
            <Link to="/join" style={{ color: "var(--cyber-gold)", fontWeight: 600, textDecoration: "none", fontSize: "0.7rem" }}>
              Join Now →
            </Link>
          </div>
          {discordMembers && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>Discord Hub:</span>
              <span style={{ color: "var(--cyber-gold)" }}>{discordMembers}</span>
            </div>
          )}
        </div>
      </div>
      
      {campusLocation && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--glass-border)", paddingTop: "12px", marginTop: "12px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C853", animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
            {campusLocation}
          </span>
        </div>
      )}
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
