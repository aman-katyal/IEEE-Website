import { ChevronLeft, Calendar as CalendarIcon, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "next-themes";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function CalendarPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Official IEEE Blue for the calendar accents
  const calendarColor = "00629B";
  const calendarBaseUrl = `https://calendar.google.com/calendar/embed?src=7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1%40group.calendar.google.com&ctz=America%2FIndiana%2FIndianapolis&color=%23${calendarColor}`;

  // CSS Filter to make Google Calendar look dark
  // We invert it, then rotate hue to keep the blues blue, then adjust contrast/brightness
  const darkCalendarFilter = "invert(90%) hue-rotate(180deg) brightness(1.1) contrast(90%)";

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
          
          <div className="flex justify-between items-end flex-wrap gap-6">
            <p
              className="font-body text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl"
            >
              Interactive month and week views of all Purdue IEEE activities. 
              Click on an event to see more details and add it to your own calendar.
            </p>

            <Button asChild className="gap-2.5 px-6 py-6">
              <a
                href="https://calendar.google.com/calendar/u/0/r?cid=7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <ExternalLink size={16} />
                Subscribe to Calendar
              </a>
            </Button>
          </div>
        </div>

        {/* Main Calendar View (Month View) */}
        <Card 
          className="glass-card p-2 border-[var(--glass-border)] shadow-none mb-16 overflow-x-auto"
          style={{ 
            background: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(128, 128, 128, 0.05)",
          }}
        >
          <div className="rounded-sm overflow-hidden min-w-[600px] transition-all duration-400"
               style={{ background: isDark ? "#111" : "#fff" }}>
            <iframe
              src={`${calendarBaseUrl}&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`}
              className="w-full border-0 transition-all duration-400"
              style={{ 
                height: "clamp(500px, 70vh, 800px)",
                filter: isDark ? darkCalendarFilter : "none",
              }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </Card>

        {/* Quarterly / 3-Month Overview Header */}
        <div className="mb-8 border-t border-[var(--glass-border)] pt-16">
           <div className="flex items-center gap-3 mb-3">
             <CalendarIcon size={20} className="text-[var(--electric-blue)]" />
             <h3 className="font-headline text-2xl font-semibold text-[var(--text-primary)]">
               Upcoming <span className="text-[var(--electric-blue)]">Overview</span>
             </h3>
           </div>
           <p className="text-[var(--text-muted)] text-sm">
             A high-level list of upcoming events for the next few months.
           </p>
        </div>

        {/* Agenda View */}
        <Card 
          className="glass-card p-2 border-[var(--glass-border)] shadow-none"
          style={{ 
            background: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(128, 128, 128, 0.05)",
          }}
        >
          <div className="rounded-sm overflow-hidden transition-all duration-400"
               style={{ background: isDark ? "#111" : "#fff" }}>
            <iframe
              src={`${calendarBaseUrl}&mode=AGENDA&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0`}
              className="w-full border-0 transition-all duration-400"
              style={{ 
                height: "500px",
                filter: isDark ? darkCalendarFilter : "none",
              }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </Card>

        {/* Info Box */}
        <Card 
          className="mt-12 border-none shadow-none bg-[rgba(235,211,169,0.05)] border-l-4 border-[var(--cyber-gold)]"
        >
          <CardContent className="flex gap-4 p-5 items-start">
            <Info size={20} className="text-[var(--cyber-gold)] shrink-0 mt-0.5" />
            <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed font-body">
              The calendar above is synced directly with Google Calendar. Use the tabs at the top of the calendar to switch between <strong>Month</strong>, <strong>Week</strong>, and <strong>Agenda</strong> views. If you are a committee chair and need to add events, please contact the Infrastructure chair.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
