import React from "react";
import { MapPin, ChevronRight, Clock, CalendarPlus } from "lucide-react";
import type { CalendarEvent } from "../../../../hooks/useGoogleCalendarEvents";
import { fmtDate, fmtDay, fmtYear, fmtTime } from "../../../../lib/dateUtils";

export interface EventCardProps {
  event: CalendarEvent;
  isFirst?: boolean;
  isLight?: boolean;
}

export const EventCard = React.memo(function EventCard({
  event,
  isFirst,
  isLight,
}: EventCardProps) {
  const handleClick = React.useCallback(() => {
    if (event.htmlLink) {
      try {
        const urlObj = new URL(event.htmlLink);
        if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
          window.open(urlObj.href, "_blank", "noopener,noreferrer");
        }
      } catch {
        // Invalid URL, do nothing safely
      }
    }
  }, [event.htmlLink]);

  return (
    <div
      onClick={handleClick}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="event-card responsive-event-card"
        style={{
          borderRadius: "0 4px 4px 0",
          padding: "clamp(16px, 4vw, 24px)",
          display: "flex",
          gap: "clamp(16px, 4vw, 24px)",
          alignItems: "flex-start",
          cursor: "pointer",
          borderLeftColor: isFirst ? "var(--cyber-gold)" : undefined,
        }}
      >
        {/* Date column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            minWidth: "56px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            {fmtDay(event.start)}
          </div>
          <div
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--electric-blue)",
              lineHeight: 1,
            }}
          >
            {fmtDate(event.start)}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              color: "var(--text-muted)",
              opacity: isLight ? 1 : 0.6,
            }}
          >
            {fmtYear(event.start)}
          </div>
        </div>

        {/* Vertical rule (hidden on small mobile) */}
        <div
          className="hidden xs:block"
          style={{
            width: "1px",
            alignSelf: "stretch",
            background: "var(--text-muted)",
            opacity: isLight ? 0.2 : 0.1,
            flexShrink: 0,
          }}
        />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(15px, 4vw, 16px)",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "4px",
              lineHeight: 1.3,
            }}
          >
            {event.title}
          </h3>
          {event.description && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "12px",
                lineHeight: 1.5,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                opacity: isLight ? 1 : 0.9,
              }}
            >
              {event.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "clamp(12px, 3vw, 16px)",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {!event.isAllDay && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Clock
                  size={11}
                  style={{
                    color: isLight
                      ? "var(--electric-blue)"
                      : "var(--text-muted)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                    opacity: isLight ? 1 : 0.8,
                  }}
                >
                  {fmtTime(event.start, event.end)}
                </span>
              </div>
            )}
            {event.location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <MapPin
                  size={11}
                  style={{
                    color: isLight
                      ? "var(--electric-blue)"
                      : "var(--text-muted)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
                    opacity: isLight ? 1 : 0.8,
                  }}
                >
                  {event.location}
                </span>
              </div>
            )}
            {/* Add to Calendar mini-button */}
            <a
              href={event.addToCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Add ${event.title} to calendar`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.08em",
                color: "var(--electric-blue)",
                textDecoration: "none",
                textTransform: "uppercase",
                marginLeft: "auto",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--cyber-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--electric-blue)";
              }}
            >
              <CalendarPlus size={11} />
              Add
            </a>
          </div>
        </div>

        {/* Arrow (hidden on very small screens) */}
        <div
          className="hidden xs:block"
          style={{ flexShrink: 0, paddingTop: "4px" }}
        >
          <ChevronRight
            size={16}
            style={{ color: "var(--text-muted)", opacity: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
});
