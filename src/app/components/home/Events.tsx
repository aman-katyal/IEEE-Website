import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "next-themes";
import { useGoogleCalendarEvents } from "../../../hooks/useGoogleCalendarEvents";
import { EventCard } from "./events/EventCard";
import { NextEventSidebar } from "./events/NextEventSidebar";
import { EventSkeleton } from "./events/EventSkeleton";

export function Events() {
  const { events: liveEvents, loading } = useGoogleCalendarEvents();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const events = liveEvents;

  // Limit to 4 events for the home page
  const displayEvents = events.slice(0, 4);
  const nextEvent = events[0];

  return (
    <section
      id="events"
      style={{
        background: "var(--boiler-black)",
        padding: "96px 0",
        position: "relative",
      }}
    >
      {/* Background grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: isLight ? 0.6 : 0.4 }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(16px, 5vw, 32px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "48px",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <p className="section-eyebrow" style={{ marginBottom: "12px" }}>
              // Upcoming Events
            </p>
            <h2
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              What's Happening{" "}
              <span style={{ color: "var(--electric-blue)" }}>Next</span>
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                opacity: isLight ? 1 : 0.8,
              }}
            >
              {loading ? "..." : `${events.length} upcoming events`}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="ieee-grid-sidebar">
          {/* Events list */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {loading ? (
              <>
                <EventSkeleton />
                <EventSkeleton />
                <EventSkeleton />
              </>
            ) : (
              <>
                {events.length === 0 ? (
                  <div
                    className="glass-card"
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "15px",
                        color: "var(--text-secondary)",
                        marginBottom: "16px",
                      }}
                    >
                      No upcoming events right now. Check back soon!
                    </p>
                    <Link
                      to="/calendar"
                      className="btn-ghost"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        textDecoration: "none",
                      }}
                    >
                      View full semester calendar
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                ) : (
                  displayEvents.map((event, i) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isFirst={i === 0}
                      isLight={isLight}
                    />
                  ))
                )}

                {/* View All Events Button */}
                <Link
                  to="/calendar"
                  className="btn-ghost"
                  style={{
                    marginTop: "16px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    textDecoration: "none",
                    width: "100%",
                  }}
                >
                  View All Events
                  <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Sidebar — Next Event Highlight */}
          {nextEvent && !loading && <NextEventSidebar nextEvent={nextEvent} />}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .responsive-event-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            border-left: none !important;
            border-top: 2px solid var(--electric-blue) !important;
            border-radius: 0 0 4px 4px !important;
          }
          .responsive-event-card > div:first-child {
            flex-direction: row !important;
            width: 100% !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}
