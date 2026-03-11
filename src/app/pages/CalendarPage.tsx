import { ChevronLeft, Calendar as CalendarIcon, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router";

export function CalendarPage() {
  const calendarBaseUrl = "https://calendar.google.com/calendar/embed?src=7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1%40group.calendar.google.com&ctz=America%2FIndiana%2FIndianapolis";

  return (
    <section
      style={{
        background: "var(--boiler-black)",
        minHeight: "100vh",
        padding: "120px 0 96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.25 }}
      />

      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,98,155,0.6) 30%, rgba(235,211,169,0.4) 50%, rgba(0,98,155,0.6) 70%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1400px", // Slightly wider for full calendar
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Breadcrumb / Back */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "rgba(248, 249, 250, 0.4)",
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "32px",
            transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--electric-blue)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "rgba(248, 249, 250, 0.4)")}
        >
          <ChevronLeft size={14} />
          Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
            // Full Schedule
          </p>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--stellar-white)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            Events <span style={{ color: "var(--electric-blue)" }}>Calendar</span>
          </h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                color: "rgba(248,249,250,0.6)",
                lineHeight: 1.6,
                maxWidth: "700px",
              }}
            >
              Interactive month and week views of all Purdue IEEE activities. 
              Click on an event to see more details and add it to your own calendar.
            </p>

            <a
              href="https://calendar.google.com/calendar/u/0/r?cid=7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
            >
              <ExternalLink size={16} />
              Subscribe to Calendar
            </a>
          </div>
        </div>

        {/* Main Calendar View (Month View) */}
        <div 
          className="glass-card" 
          style={{ 
            padding: "8px", 
            background: "rgba(0, 30, 60, 0.2)",
            borderColor: "rgba(0, 98, 155, 0.2)",
            marginBottom: "64px"
          }}
        >
          <div style={{ borderRadius: "4px", overflow: "hidden", background: "#fff" }}>
            <iframe
              src={`${calendarBaseUrl}&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`}
              style={{ border: 0, width: "100%", height: "800px" }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>

        {/* Quarterly / 3-Month Overview Header */}
        <div style={{ marginBottom: "32px", borderTop: "1px solid rgba(235, 211, 169, 0.1)", paddingTop: "64px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
             <CalendarIcon size={20} style={{ color: "var(--electric-blue)" }} />
             <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "24px", fontWeight: 600, color: "var(--stellar-white)" }}>
               Upcoming <span style={{ color: "var(--electric-blue)" }}>Overview</span>
             </h3>
           </div>
           <p style={{ color: "rgba(248, 249, 250, 0.4)", fontSize: "14px" }}>
             A high-level list of upcoming events for the next few months.
           </p>
        </div>

        {/* Agenda View (Acts as a multi-month summary) */}
        <div 
          className="glass-card" 
          style={{ 
            padding: "8px", 
            background: "rgba(0, 30, 60, 0.2)",
            borderColor: "rgba(0, 98, 155, 0.1)"
          }}
        >
          <div style={{ borderRadius: "4px", overflow: "hidden", background: "#fff" }}>
            <iframe
              src={`${calendarBaseUrl}&mode=AGENDA&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0`}
              style={{ border: 0, width: "100%", height: "500px" }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>

        {/* Info Box */}
        <div 
          style={{ 
            marginTop: "48px", 
            padding: "20px", 
            background: "rgba(235, 211, 169, 0.03)", 
            border: "1px solid rgba(235, 211, 169, 0.1)",
            borderRadius: "4px",
            display: "flex",
            gap: "16px",
            alignItems: "flex-start"
          }}
        >
          <Info size={20} style={{ color: "var(--cyber-gold)", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "13px", color: "rgba(248, 249, 250, 0.5)", lineHeight: 1.6 }}>
            The calendar above is synced directly with Google Calendar. Use the tabs at the top of the calendar to switch between <strong>Month</strong>, <strong>Week</strong>, and <strong>Agenda</strong> views. If you are a committee chair and need to add events, please contact the Infrastructure chair.
          </p>
        </div>
      </div>
    </section>
  );
}
