import { ChevronDown, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { committees } from "../../data/committees";
import { MagneticButton } from "./MagneticButton";

const LAB_IMAGE =
  "https://images.unsplash.com/photo-1619834043185-acbe47811e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHJlc2VhcmNoJTIwbGFiJTIwZGFyayUyMGhpZ2glMjB0ZWNofGVufDF8fHx8MTc3MzE4NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const handleScroll = () => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isLight = theme === "light";

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--boiler-black)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Lab Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${LAB_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: isLight ? 0.3 : 0.25,
        }}
      />

      {/* Bottom Gradient Fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight 
            ? "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(248,250,252,0.8) 85%, var(--boiler-black) 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 85%, var(--boiler-black) 100%)",
        }}
      />

      {/* 32px Grid Overlay */}
      <div
        className="ieee-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1,
        }}
      />

      {/* Electric Glow Orbs */}
      <div
        className="electric-glow-orb animate-glow-pulse"
        style={{
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          background: isLight
            ? "radial-gradient(circle, rgba(0,98,155,0.08) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(0,98,155,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="electric-glow-orb animate-glow-pulse-no-x"
        style={{
          width: "400px",
          height: "400px",
          bottom: "80px",
          right: "-60px",
          background: isLight
            ? "radial-gradient(circle, rgba(0,98,155,0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0,98,155,0.14) 0%, transparent 70%)",
          animationDelay: "2s"
        }}
      />
      <div
        className="electric-glow-orb animate-glow-pulse-no-x"
        style={{
          width: "300px",
          height: "300px",
          top: "30%",
          left: "-40px",
          background: isLight
            ? "radial-gradient(circle, rgba(133,117,77,0.03) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(235,211,169,0.05) 0%, transparent 70%)",
          animationDelay: "4s"
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "max(120px, 15vh)",
          paddingBottom: "80px",
          width: "100%",
        }}
      >
        {/* Eyebrow Tag */}
        <div
          className="animate-fade-in-up opacity-0-init stagger-1"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: isLight ? "rgba(0,90,135,0.08)" : "rgba(0,98,155,0.15)",
              border: isLight ? "1px solid rgba(0,90,135,0.2)" : "1px solid rgba(0,98,155,0.4)",
              borderRadius: "2px",
              padding: "6px 14px 6px 10px",
            }}
          >
            <Zap
              size={12}
              style={{ color: "var(--electric-blue)", fill: "var(--electric-blue)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.55rem, 1.5vw, 0.65rem)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--electric-blue)",
              }}
            >
              Purdue University · West Lafayette, IN
            </span>
          </div>

          {/* Status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00C853",
                boxShadow: isLight ? "none" : "0 0 8px #00C853",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.55rem, 1.5vw, 0.62rem)",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                opacity: isLight ? 1 : 0.8
              }}
            >
              Spring 2026 Active
            </span>
          </div>
        </div>

        {/* Main Headline (Mission Statement) */}
        <h1
          className="animate-fade-in-up opacity-0-init stagger-2"
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(34px, 5.5vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--text-primary)",
            maxWidth: "1000px",
            marginBottom: "32px",
            letterSpacing: "-0.02em",
          }}
        >
          “Fostering technological{" "}
          <span
            style={{
              color: "var(--electric-blue)",
              textShadow: isLight ? "none" : "0 0 40px rgba(0,98,155,0.3)",
            }}
          >
            innovation
          </span>{" "}
          and excellence for the benefit of{" "}
          <span
            style={{
              color: "var(--cyber-gold)",
            }}
          >
            humanity.
          </span>”
        </h1>

        <p
          className="animate-fade-in-up opacity-0-init stagger-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
            color: "var(--text-muted)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "48px",
            opacity: isLight ? 1 : 0.8
          }}
        >
          — IEEE Mission Statement
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-in-up opacity-0-init stagger-4"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            marginBottom: "72px",
          }}
        >
          <MagneticButton
            className="btn-primary"
            onClick={() => navigate("/committees")}
            style={{ width: "auto", minWidth: "180px", padding: "16px 32px" }}
          >
            Explore Committees
          </MagneticButton>
          <MagneticButton
            className="btn-ghost"
            onClick={() => navigate("/about")}
            style={{ width: "auto", minWidth: "180px", padding: "16px 32px" }}
          >
            Learn More
          </MagneticButton>

          {/* Inline Stats (visible on medium+ screens) */}
          <div
            style={{ 
              display: "flex", 
              gap: "24px",
              marginLeft: "8px"
            }}
            className="hidden sm:flex"
          >
            {[
              { value: "750+", label: "Members" },
              { value: `${committees.length}`, label: "Committees" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--electric-blue)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    opacity: isLight ? 1 : 0.8
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Meta Bar (Technical Committee Tags) */}
        <div
          className="animate-fade-in-up opacity-0-init stagger-5"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center the tiles
            gap: "10px 16px",
            flexWrap: "wrap",
            maxWidth: "900px", // Better containment
            margin: "0 auto"
          }}
        >
          {committees.map((c) => (
            <Link
              key={c.id}
              to={`/committee/${c.id}`}
              className="tech-tag"
              title={c.tagline} // Native tooltip for quick info
              style={{ 
                textDecoration: "none", 
                cursor: "pointer", 
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                padding: "6px 14px",
                fontSize: "0.68rem",
                background: "rgba(128, 128, 128, 0.03)",
                borderColor: "var(--glass-border)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--electric-blue)";
                e.currentTarget.style.color = "var(--electric-blue)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(0, 98, 155, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(128, 128, 128, 0.03)";
              }}
            >
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "currentColor", opacity: 0.5 }} />
              {c.shortName}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScroll}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          zIndex: 10,
        }}
        className="hidden md:flex animate-fade-in-up opacity-0-init stagger-5"
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            opacity: isLight ? 1 : 0.8
          }}
        >
          Scroll
        </span>
        <div className="scroll-indicator">
          <ChevronDown size={18} style={{ color: "var(--text-muted)", opacity: isLight ? 1 : 0.8 }} />
        </div>
      </button>
    </section>
  );
}
