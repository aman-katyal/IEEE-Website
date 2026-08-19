import { useState, useMemo, memo } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { usePartners } from "../../../hooks/useSanityData";

export function TechMarquee() {
  const { theme } = useTheme();
  const { partners } = usePartners();
  const isLight = theme === "light";

  // ⚡ Bolt: Cache duplicated array to prevent O(N) allocation on every render
  const displayPartners = useMemo(() => [...partners, ...partners], [partners]);

  return (
    <div
      style={{
        background: "var(--boiler-black)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "32px 0",
        overflow: "hidden",
        position: "relative",
        transition: "background 0.3s ease",
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
        {displayPartners.map((p, i) => (
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
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginTop: "24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Link
          to="/partners"
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "8px 18px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Corporate Partners <ArrowRight size={14} />
        </Link>
        <Link
          to="/committees"
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "8px 18px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Active Committees <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

const MarqueeItem = memo(function MarqueeItem({
  partner,
  isLight,
}: {
  partner: any;
  isLight: boolean;
}) {
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
    <div
      style={{
        position: "relative",
        height: "32px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {showLogo ? (
        <img
          src={logoSrc}
          alt={partner.name}
          title={partner.name}
          aria-label={partner.name}
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
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: isLight
              ? "var(--text-secondary)"
              : "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-headline)",
            letterSpacing: "0.05em",
          }}
        >
          {partner.name}
        </span>
      )}
    </div>
  );
});
