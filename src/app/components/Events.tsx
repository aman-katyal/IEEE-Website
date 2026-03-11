import { MapPin, ChevronRight, Clock, CalendarPlus, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useGoogleCalendarEvents, type CalendarEvent } from "../../hooks/useGoogleCalendarEvents";

// ─── Fallback events (used if Google Calendar API fails) ────────
const fallbackEvents = [
  {
    id: "fb-1",
    title: "Spring Technical Showcase",
    description: "All-hands project demo & industry networking",
    location: "MSEE Atrium, Purdue University",
    start: new Date("2026-03-15T13:00:00"),
    end: new Date("2026-03-15T17:00:00"),
    isAllDay: false,
    addToCalendarUrl: "#",
    htmlLink: "#",
  },
  {
    id: "fb-2",
    title: "ROV Regional Qualifier",
    description: "MATE ROV competition — Purdue qualifying round",
    location: "Corec Natatorium, West Lafayette",
    start: new Date("2026-03-22T08:00:00"),
    end: new Date("2026-03-22T18:00:00"),
    isAllDay: false,
    addToCalendarUrl: "#",
    htmlLink: "#",
  },
  {
    id: "fb-3",
    title: "Hardware Design Workshop",
    description: "PCB design fundamentals with Altium Designer",
    location: "EE 206, Purdue University",
    start: new Date("2026-04-04T18:00:00"),
    end: new Date("2026-04-04T21:00:00"),
    isAllDay: false,
    addToCalendarUrl: "#",
    htmlLink: "#",
  },
] satisfies CalendarEvent[];

// ─── Date formatting helpers ────────────────────────────────────
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function fmtDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}
function fmtDay(d: Date) { return DAYS[d.getDay()]; }
function fmtYear(d: Date) { return String(d.getFullYear()); }
function fmtTime(start: Date, end: Date) {
  const f = (d: Date) =>
    d
      .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      .toUpperCase();
  return `${f(start)} – ${f(end)}`;
}

// ─── Loading skeleton ───────────────────────────────────────────
function EventSkeleton() {
  return (
    <div
      className="event-card"
      style={{
        borderRadius: "0 4px 4px 0",
        padding: "24px",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      <div style={{ minWidth: 56, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ width: 34, height: 10, background: "rgba(248,249,250,0.06)", borderRadius: 2 }} />
        <div style={{ width: 50, height: 18, background: "rgba(248,249,250,0.08)", borderRadius: 2 }} />
        <div style={{ width: 28, height: 8, background: "rgba(248,249,250,0.04)", borderRadius: 2 }} />
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: "rgba(235,211,169,0.08)" }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: "60%", height: 16, background: "rgba(248,249,250,0.08)", borderRadius: 2, marginBottom: 8 }} />
        <div style={{ width: "90%", height: 12, background: "rgba(248,249,250,0.05)", borderRadius: 2, marginBottom: 12 }} />
        <div style={{ width: "40%", height: 10, background: "rgba(248,249,250,0.04)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────
export function Events() {
  const { events: liveEvents, loading } = useGoogleCalendarEvents();
  const events = liveEvents.length > 0 ? liveEvents : fallbackEvents;
  const isLive = liveEvents.length > 0;
  
  // Limit to 6 events for the home page
  const displayEvents = events.slice(0, 6);
  const nextEvent = events[0];

  return (
    <section
      id="events"
      style={{
        background: "#000000",
        padding: "96px 0",
        position: "relative",
      }}
    >
      {/* Background grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.4 }}
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
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "#F8F9FA",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              What's Happening{" "}
              <span style={{ color: "#00629B" }}>Next</span>
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Live indicator */}
            {isLive && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "#00C853",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#00C853",
                    boxShadow: "0 0 8px rgba(0,200,83,0.6)",
                    display: "inline-block",
                  }}
                />
                Live from Google Calendar
              </div>
            )}
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "rgba(248,249,250,0.3)",
                textTransform: "uppercase",
              }}
            >
              {loading ? "Loading..." : `${events.length} events`}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="ieee-grid-sidebar">
          {/* Events list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {loading ? (
              <>
                <EventSkeleton />
                <EventSkeleton />
                <EventSkeleton />
              </>
            ) : events.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "15px",
                    color: "rgba(248,249,250,0.4)",
                  }}
                >
                  No upcoming events right now. Check back soon!
                </p>
              </div>
            ) : (
              <>
                {displayEvents.map((event, i) => (
                  <a
                    key={event.id}
                    href={event.htmlLink || "#"}
                    target={event.htmlLink ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="event-card"
                      style={{
                        borderRadius: "0 4px 4px 0",
                        padding: "24px",
                        display: "flex",
                        gap: "24px",
                        alignItems: "flex-start",
                        cursor: "pointer",
                        borderLeftColor: i === 0 ? "#EBD3A9" : undefined,
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
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: "0.58rem",
                            letterSpacing: "0.12em",
                            color: "rgba(248,249,250,0.3)",
                            textTransform: "uppercase",
                          }}
                        >
                          {fmtDay(event.start)}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#00629B",
                            lineHeight: 1,
                          }}
                        >
                          {fmtDate(event.start)}
                        </div>
                        <div
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: "0.55rem",
                            color: "rgba(248,249,250,0.2)",
                          }}
                        >
                          {fmtYear(event.start)}
                        </div>
                      </div>

                      {/* Vertical rule */}
                      <div
                        style={{
                          width: "1px",
                          alignSelf: "stretch",
                          background: "rgba(235,211,169,0.08)",
                          flexShrink: 0,
                        }}
                      />

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#F8F9FA",
                            marginBottom: "4px",
                            lineHeight: 1.3,
                          }}
                        >
                          {event.title}
                        </h3>
                        {event.description && (
                          <p
                            style={{
                              fontFamily: "'IBM Plex Sans', sans-serif",
                              fontSize: "13px",
                              color: "rgba(248,249,250,0.45)",
                              marginBottom: "12px",
                              lineHeight: 1.5,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {event.description}
                          </p>
                        )}

                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          {!event.isAllDay && (
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <Clock
                                size={11}
                                style={{ color: "rgba(248,249,250,0.3)", flexShrink: 0 }}
                              />
                              <span
                                style={{
                                  fontFamily: "'IBM Plex Mono', monospace",
                                  fontSize: "0.62rem",
                                  color: "rgba(248,249,250,0.3)",
                                  letterSpacing: "0.06em",
                                }}
                              >
                                {fmtTime(event.start, event.end)}
                              </span>
                            </div>
                          )}
                          {event.location && (
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <MapPin
                                size={11}
                                style={{ color: "rgba(248,249,250,0.3)", flexShrink: 0 }}
                              />
                              <span
                                style={{
                                  fontFamily: "'IBM Plex Mono', monospace",
                                  fontSize: "0.62rem",
                                  color: "rgba(248,249,250,0.3)",
                                  letterSpacing: "0.06em",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
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
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: "0.58rem",
                              letterSpacing: "0.08em",
                              color: "#00629B",
                              textDecoration: "none",
                              textTransform: "uppercase",
                              marginLeft: "auto",
                              transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = "#EBD3A9";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = "#00629B";
                            }}
                          >
                            <CalendarPlus size={11} />
                            Add
                          </a>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div style={{ flexShrink: 0, paddingTop: "4px" }}>
                        <ChevronRight
                          size={16}
                          style={{ color: "rgba(248,249,250,0.2)" }}
                        />
                      </div>
                    </div>
                  </a>
                ))}
                
                {/* View All Events Button */}
                {events.length > 6 && (
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
                      width: "100%"
                    }}
                  >
                    View All Events
                    <ChevronRight size={16} />
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Sidebar — Next Event Highlight */}
          {nextEvent && !loading && (
            <div
              className="glass-card"
              style={{ padding: "32px", position: "sticky", top: "96px" }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.18em",
                  color: "#00629B",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                // Next Event
              </div>

              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "40px",
                  fontWeight: 700,
                  color: "#00629B",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {fmtDate(nextEvent.start)}
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.65rem",
                  color: "rgba(235,211,169,0.4)",
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
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#F8F9FA",
                  marginBottom: "10px",
                  lineHeight: 1.3,
                }}
              >
                {nextEvent.title}
              </h3>
              {nextEvent.description && (
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "13px",
                    color: "rgba(248,249,250,0.45)",
                    lineHeight: 1.65,
                    marginBottom: "24px",
                  }}
                >
                  {nextEvent.description}
                </p>
              )}

              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}
              >
                {!nextEvent.isAllDay && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={13} style={{ color: "#00629B", flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: "12.5px",
                        color: "rgba(248,249,250,0.45)",
                      }}
                    >
                      {fmtTime(nextEvent.start, nextEvent.end)}
                    </span>
                  </div>
                )}
                {nextEvent.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin size={13} style={{ color: "#00629B", flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: "12.5px",
                        color: "rgba(248,249,250,0.45)",
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
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: "rgba(248,249,250,0.3)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#00629B";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,249,250,0.3)";
                }}
              >
                <ExternalLink size={11} />
                View Full Calendar
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
