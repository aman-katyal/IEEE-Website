import { Link } from "react-router";
import { ArrowUpRight, Building2, ChevronRight } from "lucide-react";
import type { AlumniCompany } from "../../../../data/sanity-types";

export interface WhereEngineersGoCardProps {
  companies?: AlumniCompany[];
  highlightText?: string;
}

export function BranchTelemetryCard(props: WhereEngineersGoCardProps) {
  const { companies, highlightText } = props;

  const activeCompanies = companies && companies.length > 0 ? companies : [];

  if (activeCompanies.length === 0) {
    return null;
  }

  const half = Math.ceil(activeCompanies.length / 2);
  const row1 = activeCompanies.slice(0, half);
  const row2 = activeCompanies.slice(half);

  // Duplicate for smooth seamless infinite loop
  const row1List = row1.length > 0 ? [...row1, ...row1, ...row1] : [];
  const row2List = row2.length > 0 ? [...row2, ...row2, ...row2] : row1List;

  return (
    <div
      className="glass-card group hover:border-sky-500/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
      style={{
        padding: "20px",
        fontFamily: "var(--font-mono)",
        background: "rgba(10, 10, 12, 0.45)",
      }}
      data-testid="where-engineers-go-card"
    >
      {/* Top ambient highlight beam */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/50 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header telemetry badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "var(--electric-blue)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // Where Our Engineers Go
            </span>
          </div>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono border border-sky-500/20">
            <span>{activeCompanies.length} DESTINATIONS</span>
          </span>
        </div>

        {/* Scrolling Companies Marquee Tracks */}
        <div className="relative overflow-hidden my-2.5 py-1 -mx-2">
          {/* Edge fade gradient masks */}
          <div
            className="absolute left-0 inset-y-0 w-8 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(10, 10, 12, 0.95), transparent)",
            }}
          />
          <div
            className="absolute right-0 inset-y-0 w-8 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, rgba(10, 10, 12, 0.95), transparent)",
            }}
          />

          <div className="flex flex-col gap-2">
            {/* Track 1: Scrolls Left */}
            <div className="bento-marquee-left flex gap-2 items-center" style={{ willChange: "transform" }}>
              {row1List.map((c, i) => (
                <div
                  key={`r1-${c._key || c.name}-${i}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800/90 hover:border-sky-500/50 hover:bg-slate-800/90 transition-colors text-xs text-slate-200 shrink-0 select-none shadow-sm"
                >
                  {c.domain ? (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=32`}
                      alt=""
                      className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  )}
                  <span className="font-medium truncate max-w-[130px]">{c.name}</span>
                </div>
              ))}
            </div>

            {/* Track 2: Scrolls Right */}
            {row2List.length > 0 && (
              <div className="bento-marquee-right flex gap-2 items-center" style={{ willChange: "transform" }}>
                {row2List.map((c, i) => (
                  <div
                    key={`r2-${c._key || c.name}-${i}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800/90 hover:border-sky-500/50 hover:bg-slate-800/90 transition-colors text-xs text-slate-200 shrink-0 select-none shadow-sm"
                  >
                    {c.domain ? (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=32`}
                        alt=""
                        className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    )}
                    <span className="font-medium truncate max-w-[130px]">{c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Impact Subtitle */}
        {highlightText && (
          <p className="text-[11px] text-slate-400 leading-snug mt-1" style={{ fontFamily: "var(--font-body)" }}>
            {highlightText}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <Link
          to="/committees"
          className="px-2.5 py-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-sky-200 text-xs font-semibold transition-all flex items-center gap-1.5"
          title="Explore Technical Committees"
        >
          <span>Join a Project</span>
        </Link>

        <Link
          to="/committees"
          className="text-xs text-slate-300 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
          style={{ color: "var(--cyber-gold)" }}
        >
          <span>9 Committees</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </div>
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
