import { ChevronDown, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { committees } from "../../data/committees";

const LAB_IMAGE =
  "https://images.unsplash.com/photo-1619834043185-acbe47811e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHJlc2VhcmNoJTIwbGFiJTIwZGFyayUyMGhpZ2glMjB0ZWNofGVufDF8fHx8MTc3MzE4NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  const navigate = useNavigate();
  const handleScroll = () => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#000000",
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
          opacity: 0.18,
        }}
      />

      {/* Bottom Gradient Fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 85%, #000000 100%)",
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
        className="electric-glow-orb"
        style={{
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(0,98,155,0.22) 0%, transparent 65%)",
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
              background: "rgba(0,98,155,0.15)",
              border: "1px solid rgba(0,98,155,0.4)",
              borderRadius: "2px",
              padding: "6px 14px 6px 10px",
            }}
          >
            <Zap
              size={12}
              style={{ color: "#00629B", fill: "#00629B" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.55rem, 1.5vw, 0.65rem)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#00629B",
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
                boxShadow: "0 0 8px #00C853",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.55rem, 1.5vw, 0.62rem)",
                letterSpacing: "0.15em",
                color: "rgba(248,249,250,0.45)",
                textTransform: "uppercase",
              }}
            >
              Spring 2026 Active
            </span>
          </div>
        </div>

        {/* Main Headline (Mission Statement) */}
        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(34px, 6vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--stellar-white)",
            maxWidth: "1000px",
            marginBottom: "48px",
            letterSpacing: "-0.02em",
          }}
        >
          “Fostering technological{" "}
          <span
            style={{
              color: "var(--electric-blue)",
              textShadow: "0 0 40px rgba(0,98,155,0.3)",
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
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
            color: "rgba(248,249,250,0.4)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "48px",
            marginTop: "-24px"
          }}
        >
          — IEEE Mission Statement
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            marginBottom: "72px",
          }}
        >
          <button
            className="btn-primary"
            onClick={() => navigate("/committees")}
            style={{ width: "auto", minWidth: "180px" }}
          >
            Explore Committees
          </button>
          <button
            className="btn-ghost"
            onClick={() => navigate("/about")}
            style={{ width: "auto", minWidth: "180px" }}
          >
            Learn More
          </button>

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
                    color: "rgba(248,249,250,0.35)",
                    textTransform: "uppercase",
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px 24px",
            flexWrap: "wrap",
          }}
        >
          {committees.map((c) => (
            <Link
              key={c.id}
              to={`/committee/${c.id}`}
              className="tech-tag"
              style={{ 
                textDecoration: "none", 
                cursor: "pointer", 
                transition: "all 0.2s ease",
                padding: "4px 10px"
              }}
            >
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
        className="hidden md:flex"
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            color: "rgba(248,249,250,0.3)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div className="scroll-indicator">
          <ChevronDown size={18} style={{ color: "rgba(248,249,250,0.3)" }} />
        </div>
      </button>
    </section>
  );
}
