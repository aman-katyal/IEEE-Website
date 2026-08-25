import { Link } from "react-router";
import { ChevronRight, ArrowUpRight, MapPin, MessageSquare, Sparkles, Shield, Calendar, Users } from "lucide-react";

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
      className="glass-card group hover:border-sky-500/40 transition-all duration-300 relative overflow-hidden"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "var(--font-mono)",
        background: "rgba(10, 10, 12, 0.45)",
      }}
    >
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/40 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header telemetry badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: "var(--electric-blue)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            // Branch Overview
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400/90 border border-sky-500/20">
            EST. 1903
          </span>
        </div>

        {/* Live Branch Attributes */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-300">
          {hqLocation && (
            <div className="flex items-center justify-between gap-3 group/item">
              <span className="text-slate-400 shrink-0">HQ Location:</span>
              <Link
                to="/about"
                className="text-slate-200 hover:text-sky-400 transition-colors flex items-center gap-1 font-medium text-right"
                title="View EE 014 Lab & Office Hours"
              >
                <span>{hqLocation}</span>
                <MapPin className="w-3 h-3 text-sky-400/70 group-hover/item:text-sky-400 transition-colors shrink-0" />
              </Link>
            </div>
          )}

          {typeof committeesCount === "number" && committeesCount > 0 && (
            <div className="flex items-center justify-between gap-3 group/item">
              <span className="text-slate-400 shrink-0">Active Projects:</span>
              <Link
                to="/committees"
                className="text-slate-200 hover:text-sky-400 transition-colors flex items-center gap-1 font-medium"
                title="Explore Technical Committees"
              >
                <span>{committeesCount} Committees</span>
                <ArrowUpRight className="w-3 h-3 text-sky-400/70 group-hover/item:text-sky-400 transition-colors shrink-0" />
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400 shrink-0">Membership:</span>
            <Link
              to="/join"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
              style={{ color: "var(--cyber-gold)" }}
            >
              Join Now →
            </Link>
          </div>

          {discordMembers && (
            <div className="flex items-center justify-between gap-3 group/item">
              <span className="text-slate-400 shrink-0">Discord Hub:</span>
              <a
                href="https://discord.gg/purdueieee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 font-medium"
                style={{ color: "var(--cyber-gold)" }}
                title="Join Purdue IEEE Discord"
              >
                <span>{discordMembers}</span>
                <MessageSquare className="w-3 h-3 text-amber-400/70 group-hover/item:text-amber-300 transition-colors shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Fast Action Shortcuts */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-[11px]">
          <Link
            to="/committees"
            className="px-2 py-1.5 rounded bg-slate-900/60 hover:bg-sky-500/10 border border-slate-800 hover:border-sky-500/30 text-slate-300 hover:text-sky-300 transition-all text-center flex items-center justify-center gap-1"
          >
            <Users className="w-3 h-3 text-sky-400 shrink-0" />
            <span>Teams</span>
          </Link>
          <Link
            to="/calendar"
            className="px-2 py-1.5 rounded bg-slate-900/60 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 transition-all text-center flex items-center justify-center gap-1"
          >
            <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Events</span>
          </Link>
          <Link
            to="/finance"
            className="px-2 py-1.5 rounded bg-slate-900/60 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 transition-all text-center flex items-center justify-center gap-1"
            title="BoilerBooks Financial Portal"
          >
            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Finance</span>
          </Link>
        </div>
      </div>

      {campusLocation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "12px",
            marginTop: "12px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#00C853",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
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
