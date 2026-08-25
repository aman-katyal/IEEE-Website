import { Link } from "react-router";
import {
  Calendar,
  MapPin,
  CalendarPlus,
  Radio,
  ArrowUpRight,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import type { CalendarEvent } from "../../../../hooks/useGoogleCalendarEvents";
import { fmtDate, fmtTime } from "../../../../lib/dateUtils";

export interface EventRadarCardProps {
  event?: CalendarEvent | null;
  loading?: boolean;
  upcomingCount?: number;
  // Backward-compatible props
  hqLocation?: string | null;
  committeesCount?: number;
  discordMembers?: string | null;
  campusLocation?: string | null;
}

export function BranchTelemetryCard(props: EventRadarCardProps) {
  const { event, loading, upcomingCount } = props;

  return (
    <div
      className="glass-card group hover:border-sky-500/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
      style={{
        padding: "20px",
        fontFamily: "var(--font-mono)",
        background: "rgba(10, 10, 12, 0.45)",
      }}
      data-testid="event-radar-card"
    >
      {/* Top ambient highlight beam */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/50 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header telemetry badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse shrink-0" />
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "var(--electric-blue)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // Callout & Event Radar
            </span>
          </div>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>RADAR</span>
          </span>
        </div>

        {/* Dynamic Event Content */}
        {loading ? (
          <div className="py-4 space-y-2 animate-pulse">
            <div className="h-3 bg-slate-800 rounded w-1/3" />
            <div className="h-4 bg-slate-700 rounded w-4/5" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
        ) : event ? (
          <div className="space-y-2.5">
            {/* Date and Time Header */}
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>
                {fmtDate(event.start)} · {event.isAllDay ? "All Day" : fmtTime(event.start, event.end)}
              </span>
            </div>

            {/* Event Title */}
            <h3
              className="text-sm font-bold text-white leading-snug line-clamp-2 hover:text-sky-300 transition-colors"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {event.title}
            </h3>

            {/* Location Pill */}
            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        ) : (
          /* Default Radar Display when no single event in active feed */
          <div className="space-y-2">
            <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Upcoming Callouts & Workshops</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
              General branch callouts, technical committee workshops, and project sessions in EE 014 & EE 129.
            </p>
            {props.hqLocation && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                <span>HQ: {props.hqLocation}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {event?.addToCalendarUrl ? (
          <a
            href={event.addToCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-sky-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Add this event to Google Calendar"
          >
            <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Add to Cal</span>
          </a>
        ) : (
          <a
            href="https://discord.gg/purdueieee"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-sky-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Join Discord for event notifications"
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>Alerts</span>
          </a>
        )}

        <Link
          to="/calendar"
          className="text-xs text-slate-300 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
          style={{ color: "var(--cyber-gold)" }}
        >
          <span>{typeof upcomingCount === "number" && upcomingCount > 0 ? `${upcomingCount} Events` : "All Events"}</span>
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
