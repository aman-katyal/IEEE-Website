import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export interface RackSlot {
  id: string;
  tag: string;
  title: string;
  displayTitle: string; // Pre-computed: title with parenthetical suffix stripped
  description: string;
  meeting: string;
  link: string;
}

export function makeDisplayTitle(title: string) {
  return title.replace(/\(.*\)/, "").trim();
}

export interface LabStatusRackProps {
  committees: any[];
  isLight?: boolean;
}

export function LabStatusRack({ committees, isLight }: LabStatusRackProps) {
  const [hoveredSlot, setHoveredSlot] = useState<RackSlot | null>(null);

  const activeSlots: RackSlot[] = useMemo(() => {
    return (committees && committees.length > 0)
      ? committees.map((c) => {
          return {
            id: c.id,
            tag: c.shortName ?? c.id.toUpperCase(),
            title: c.name,
            displayTitle: makeDisplayTitle(c.name),
            description: c.description ?? c.tagline ?? "",
            meeting: c.meetingSchedule ?? "Announced on Discord",
            link: `/committee/${c.id}`,
          };
        })
      : [];
  }, [committees]);

  return (
    <div
      className="glass-card pcb-bento-tile"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "rgba(0, 30, 60, 0.03)",
        borderColor: isLight ? "rgba(0, 90, 135, 0.15)" : "rgba(0, 98, 155, 0.2)",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "var(--electric-blue)",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          // Active Committees & Projects
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Select or hover any committee below to view details:
        </div>

        {/* Visual Server/Equipment Rack Layout */}
        <div
          className="rack-slots-grid"
          onMouseLeave={() => setHoveredSlot(null)}
        >
          {activeSlots.length > 0 ? (
            activeSlots.map((slot) => {
              const isHovered = hoveredSlot?.id === slot.id;

              return (
                <Link
                  key={slot.id}
                  to={slot.link}
                  aria-label={`Inspect committee details for ${slot.displayTitle}`}
                  onMouseEnter={() => setHoveredSlot(slot)}
                  onFocus={() => setHoveredSlot(slot)}
                  onClick={() => setHoveredSlot(slot)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${isHovered ? "var(--electric-blue)" : "rgba(255,255,255,0.06)"}`,
                    borderLeft: `3px solid ${isHovered ? "var(--electric-blue)" : "rgba(255,255,255,0.12)"}`,
                    background: isHovered
                      ? "rgba(0, 98, 155, 0.1)"
                      : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    textDecoration: "none",
                  }}
                >
                  {/* Pill tag badge */}
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                    background: isHovered
                      ? "rgba(0, 98, 155, 0.28)"
                      : "rgba(0, 98, 155, 0.18)",
                    border: `1px solid ${isHovered ? "var(--electric-blue)" : "rgba(0,98,155,0.4)"}`,
                    borderRadius: "4px",
                    padding: "2px 7px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "var(--electric-blue)",
                    whiteSpace: "nowrap",
                    transition: "all 0.18s ease",
                  }}>
                    {slot.tag}
                  </span>

                  {/* Committee Name */}
                  <span style={{
                    flex: 1,
                    minWidth: 0,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isHovered ? "var(--text-primary)" : "rgba(248,249,250,0.75)",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                    transition: "color 0.18s ease",
                  }}>
                    {slot.displayTitle}
                  </span>
                </Link>
              );
            })
          ) : (
            <div style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.65rem", textAlign: "center", padding: "24px 0" }}>
              // NO_COMMITTEES_FOUND — configure in Sanity Studio
            </div>
          )}
        </div>
      </div>

      {/* Stateful Info Panel inside card */}
      <div
        style={{
          background: isLight ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.2)",
          border: "1px solid var(--glass-border)",
          borderRadius: "4px",
          padding: "16px",
          minHeight: "90px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
      >
        <AnimatePresence mode="wait">
          {hoveredSlot ? (
            <motion.div
              key={hoveredSlot.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--cyber-gold)",
                  }}
                >
                  {hoveredSlot.title}
                </h4>
                <Link
                  to={hoveredSlot.link}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "2px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.55rem",
                    color: "var(--electric-blue)",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 700,
                  }}
                >
                  Go to Team
                  <ArrowUpRight size={10} />
                </Link>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {hoveredSlot.description}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              Hover over any committee slot above to view active project details.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
