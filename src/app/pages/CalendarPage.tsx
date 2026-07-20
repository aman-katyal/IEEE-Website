import { ChevronLeft, Calendar as CalendarIcon, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useSiteSettings } from "../../hooks/useSanityData";

export function CalendarPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { settings, loading } = useSiteSettings();
  
  // Official IEEE Blue for the calendar accents
  const calendarColor = "00629B";
  const calendarId = settings?.calendarId || "7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1%40group.calendar.google.com";
  const calendarBaseUrl = settings?.calendarUrl || `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=America%2FIndiana%2FIndianapolis&color=%23${calendarColor}`;
  const subscribeUrl = `https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`;

  // CSS Filter to make Google Calendar look dark
  const darkCalendarFilter = "invert(90%) hue-rotate(180deg) brightness(1.1) contrast(90%)";

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--boiler-black)", color: "var(--text-primary)" }}>Loading...</div>;
  }

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
            "linear-gradient(90deg, transparent 0%, var(--electric-blue) 30%, var(--cyber-gold) 50%, var(--electric-blue) 70%, transparent 100%)",
          opacity: 0.4
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
            color: "var(--text-muted)",
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "32px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--electric-blue)";
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
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
              color: "var(--text-primary)",
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
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: "700px",
              }}
            >
              Interactive month and week views of all Purdue IEEE activities. 
              Click on an event to see more details and add it to your own calendar.
            </p>

            <a
              href={subscribeUrl}
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
            background: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(128, 128, 128, 0.05)",
            borderColor: "var(--glass-border)",
            marginBottom: "64px",
            overflowX: "auto"
          }}
        >
          <div style={{ 
            borderRadius: "4px", 
            overflow: "hidden", 
            background: isDark ? "#111" : "#fff", 
            minWidth: "600px",
            transition: "all 0.4s ease"
          }}>
            <iframe
              src={`${calendarBaseUrl}&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`}
              style={{ 
                border: 0, 
                width: "100%", 
                height: "clamp(500px, 70vh, 800px)",
                filter: isDark ? darkCalendarFilter : "none",
                transition: "filter 0.4s ease"
              }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>

        {/* Quarterly / 3-Month Overview Header */}
        <div style={{ marginBottom: "32px", borderTop: "1px solid var(--glass-border)", paddingTop: "64px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
             <CalendarIcon size={20} style={{ color: "var(--electric-blue)" }} />
             <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "24px", fontWeight: 600, color: "var(--text-primary)" }}>
               Upcoming <span style={{ color: "var(--electric-blue)" }}>Overview</span>
             </h3>
           </div>
           <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
             A high-level list of upcoming events for the next few months.
           </p>
        </div>

        {/* Agenda View */}
        <div 
          className="glass-card" 
          style={{ 
            padding: "8px", 
            background: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(128, 128, 128, 0.05)",
            borderColor: "var(--glass-border)"
          }}
        >
          <div style={{ 
            borderRadius: "4px", 
            overflow: "hidden", 
            background: isDark ? "#111" : "#fff",
            transition: "all 0.4s ease"
          }}>
            <iframe
              src={`${calendarBaseUrl}&mode=AGENDA&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0`}
              style={{ 
                border: 0, 
                width: "100%", 
                height: "500px",
                filter: isDark ? darkCalendarFilter : "none",
                transition: "filter 0.4s ease"
              }}
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
            background: "rgba(235, 211, 169, 0.05)", 
            border: "1px solid var(--glass-border)",
            borderRadius: "4px",
            display: "flex",
            gap: "16px",
            alignItems: "flex-start"
          }}
        >
          <Info size={20} style={{ color: "var(--cyber-gold)", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            The calendar above is synced directly with Google Calendar. Use the tabs at the top of the calendar to switch between <strong>Month</strong>, <strong>Week</strong>, and <strong>Agenda</strong> views. If you are a committee chair and need to add events, please contact the Infrastructure chair.
          </p>
        </div>
      </div>
    </section>
  );
}
