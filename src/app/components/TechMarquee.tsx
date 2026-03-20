import { useTheme } from "next-themes";

const partners = [
  { name: "Texas Instruments", domain: "ti.com" },
  { name: "Qualcomm", domain: "qualcomm.com" },
  { name: "SpaceX", domain: "spacex.com" },
  { name: "Intel", domain: "intel.com" },
  { name: "NVIDIA", domain: "nvidia.com" },
  { name: "Lockheed Martin", domain: "lockheedmartin.com" },
  { name: "Raytheon Technologies", domain: "rtx.com" },
  { name: "Northrop Grumman", domain: "northropgrumman.com" },
  { name: "Boeing", domain: "boeing.com" },
  { name: "L3Harris", domain: "l3harris.com" },
  { name: "AMD", domain: "amd.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Cisco", domain: "cisco.com" },
  { name: "Honeywell", domain: "honeywell.com" },
  { name: "Caterpillar", domain: "caterpillar.com" },
];

export function TechMarquee() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      style={{
        background: "var(--boiler-black)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "32px 0",
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
          width: "150px",
          background: isLight 
            ? "linear-gradient(to right, #F8FAFC, transparent)"
            : "linear-gradient(to right, var(--boiler-black), transparent)",
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "150px",
          background: isLight 
            ? "linear-gradient(to left, #F8FAFC, transparent)"
            : "linear-gradient(to left, var(--boiler-black), transparent)",
          zIndex: 5,
        }}
      />

      <div className="marquee-track" style={{ willChange: "transform" }}>
        {[...partners, ...partners].map((p, i) => (
          <div
            key={`${p.domain}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "48px",
              padding: "0 48px",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative", height: "32px", display: "flex", alignItems: "center" }}>
              <img 
                src={`https://logo.clearbit.com/${p.domain}`} 
                alt={p.name} 
                loading="lazy"
                style={{ 
                  height: "32px", 
                  width: "auto", 
                  maxWidth: "140px",
                  filter: isLight 
                    ? "grayscale(1) opacity(0.6)" 
                    : "grayscale(1) invert(1) brightness(1.5) opacity(0.5)",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  willChange: "transform, filter",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "grayscale(0) opacity(1)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = isLight 
                    ? "grayscale(1) opacity(0.6)" 
                    : "grayscale(1) invert(1) brightness(1.5) opacity(0.5)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
            
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--electric-blue)",
                flexShrink: 0,
                opacity: 0.4
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
