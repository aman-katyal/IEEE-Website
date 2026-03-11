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
        background: "#000000",
        borderTop: "1px solid rgba(235,211,169,0.07)",
        borderBottom: "1px solid rgba(235,211,169,0.07)",
        padding: "20px 0",
        overflow: "hidden",
        position: "relative",
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
            "linear-gradient(to right, #000000, transparent)",
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
            "linear-gradient(to left, #000000, transparent)",
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
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(248,249,250,0.2)",
                whiteSpace: "nowrap",
              }}
            >
              {p}
            </span>
            <div
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(0,98,155,0.5)",
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
