const partners = [
  "Texas Instruments",
  "Qualcomm",
  "SpaceX",
  "Intel",
  "NVIDIA",
  "Lockheed Martin",
  "Raytheon",
  "Northrop Grumman",
  "Boeing",
  "L3Harris",
  "AMD",
  "Apple",
  "Cisco",
  "Honeywell",
  "Caterpillar",
];

export function TechMarquee() {
  return (
    <div
      style={{
        background: "var(--boiler-black)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "20px 0",
        overflow: "hidden",
        position: "relative",
        transition: "background 0.3s ease"
      }}
    >
      {/* Fade edges */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "120px",
          background:
            "linear-gradient(to right, var(--boiler-black), transparent)",
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "120px",
          background:
            "linear-gradient(to left, var(--boiler-black), transparent)",
          zIndex: 5,
        }}
      />

      <div className="marquee-track">
        {[...partners, ...partners].map((p, i) => (
          <div
            key={`${p}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              padding: "0 32px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                opacity: 0.4
              }}
            >
              {p}
            </span>
            <div
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "var(--electric-blue)",
                flexShrink: 0,
                opacity: 0.5
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
