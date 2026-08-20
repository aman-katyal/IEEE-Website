import { Link } from "react-router";
import { Clock, MapPin, CalendarPlus, ExternalLink } from "lucide-react";
import type { CalendarEvent } from "../../../../hooks/useGoogleCalendarEvents";
import { fmtDate, fmtDay, fmtYear, fmtTime } from "../../../../lib/dateUtils";

export interface NextEventSidebarProps {
  nextEvent: CalendarEvent;
}

export function NextEventSidebar({ nextEvent }: NextEventSidebarProps) {
  return (
    <div
      className="glass-card next-event-sidebar animate-float-no-x"
      style={{
        padding: "clamp(24px, 5vw, 32px)",
        position: "sticky",
        top: "96px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          color: "var(--electric-blue)",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        // Next Event
      </div>

      <div
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "clamp(32px, 6vw, 40px)",
          fontWeight: 700,
          color: "var(--electric-blue)",
          lineHeight: 1,
          marginBottom: "4px",
        }}
      >
        {fmtDate(nextEvent.start)}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        {fmtDay(nextEvent.start)} · {fmtYear(nextEvent.start)}
      </div>

      <div className="gold-divider" style={{ marginBottom: "20px" }} />

      <h3
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "18px",
          fontWeight: 600,
          color: "var(--stellar-white)",
          marginBottom: "10px",
          lineHeight: 1.3,
        }}
      >
        {nextEvent.title}
      </h3>
      {nextEvent.description && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            marginBottom: "24px",
          }}
        >
          {nextEvent.description}
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {!nextEvent.isAllDay && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Clock
              size={13}
              style={{ color: "var(--electric-blue)", flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12.5px",
                color: "var(--text-secondary)",
              }}
            >
              {fmtTime(nextEvent.start, nextEvent.end)}
            </span>
          </div>
        )}
        {nextEvent.location && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <MapPin
              size={13}
              style={{ color: "var(--electric-blue)", flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12.5px",
                color: "var(--text-secondary)",
              }}
            >
              {nextEvent.location}
            </span>
          </div>
        )}
      </div>

      <a
        href={nextEvent.addToCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        aria-label={`Add ${nextEvent.title} to Google Calendar`}
        style={{
          width: "100%",
          textAlign: "center",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          textDecoration: "none",
        }}
      >
        <CalendarPlus size={15} />
        Add to Google Calendar
      </a>

      {/* View full calendar link */}
      <Link
        to="/calendar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginTop: "12px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          textDecoration: "none",
          textTransform: "uppercase",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "var(--electric-blue)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "var(--text-muted)";
        }}
      >
        <ExternalLink size={11} />
        View Full Calendar
      </Link>
    </div>
  );
}
