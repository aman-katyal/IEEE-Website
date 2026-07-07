import { useState } from "react";
import { useTheme } from "next-themes";
import { usePartners } from "../../hooks/useSanityData";

export function TechMarquee() {
  const { theme } = useTheme();
  const { partners: sanityPartners } = usePartners();
  const isLight = theme === "light";

  const staticPartners: { name: string; domain: string; logoUrl?: string }[] = [
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

  const partners = sanityPartners.length > 0 ? sanityPartners : staticPartners;

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
            key={`${p.domain || p.name}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "48px",
              padding: "0 48px",
              flexShrink: 0,
            }}
          >
            <MarqueeItem partner={p} isLight={isLight} />
            
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

function MarqueeItem({ partner, isLight }: { partner: any; isLight: boolean }) {
  const [logoError, setLogoError] = useState(false);
  const [useFavicon, setUseFavicon] = useState(false);
  
  // Resolve source: Sanity URL -> unavatar clearbit proxy (bypasses adblockers) -> Google S2 favicon
  let logoSrc = partner.logoUrl;
  if (!logoSrc && partner.domain) {
    if (useFavicon) {
      logoSrc = `https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`;
    } else {
      logoSrc = `https://unavatar.io/clearbit/${partner.domain}`;
    }
  }

  const handleImageError = () => {
    if (!useFavicon && partner.domain) {
      setUseFavicon(true);
    } else {
      setLogoError(true);
    }
  };

  const showLogo = logoSrc && !logoError;

  return (
    <div style={{ position: "relative", height: "32px", display: "flex", alignItems: "center" }}>
      {showLogo ? (
        <img 
          src={logoSrc} 
          alt={partner.name} 
          loading="lazy"
          onError={handleImageError}
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
      ) : (
        <span style={{ 
          fontSize: "14px", 
          fontWeight: 600, 
          color: isLight ? "var(--text-secondary)" : "rgba(255, 255, 255, 0.5)",
          fontFamily: "var(--font-headline)",
          letterSpacing: "0.05em",
        }}>
          {partner.name}
        </span>
      )}
    </div>
  );
}


