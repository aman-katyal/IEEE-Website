import { ChevronDown, Zap } from "lucide-react";
import { Link } from "react-router";
import { committees } from "../../data/committees";

const LAB_IMAGE =
  "https://images.unsplash.com/photo-1619834043185-acbe47811e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHJlc2VhcmNoJTIwbGFiJTIwZGFyayUyMGhpZ2glMjB0ZWNofGVufDF8fHx8MTc3MzE4NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  const handleScroll = () => {
    const el = document.querySelector("#committees");
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
          width: "700px",
          height: "700px",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(0,98,155,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="electric-glow-orb"
        style={{
          width: "400px",
          height: "400px",
          bottom: "80px",
          right: "-60px",
          background:
            "radial-gradient(circle, rgba(0,98,155,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        className="electric-glow-orb"
        style={{
          width: "300px",
          height: "300px",
          top: "30%",
          left: "-40px",
          background:
            "radial-gradient(circle, rgba(235,211,169,0.05) 0%, transparent 70%)",
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
          paddingTop: "120px",
          paddingBottom: "80px",
          width: "100%",
        }}
      >
        {/* Eyebrow Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
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
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
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
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(248,249,250,0.45)",
                textTransform: "uppercase",
              }}
            >
              Spring 2026 Active
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(42px, 7vw, 88px)",
            fontWeight: 700,
            lineHeight: 1.04,
            color: "#F8F9FA",
            maxWidth: "820px",
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          Engineering{" "}
          <span
            style={{
              color: "#00629B",
              textShadow: "0 0 40px rgba(0,98,155,0.5)",
            }}
          >
            Tomorrow's
          </span>
          <br />
          Technology,{" "}
          <span
            style={{
              color: "#EBD3A9",
            }}
          >
            Today.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "rgba(248,249,250,0.55)",
            maxWidth: "560px",
            marginBottom: "48px",
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          Purdue's premier technical organization advancing research, 
          innovation, and collaboration across engineering disciplines. 
          750+ members. 9 active technical committees.
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
            onClick={() => {
              document.querySelector("#committees")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Committees
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn More
          </button>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "32px",
              background: "rgba(235,211,169,0.2)",
              margin: "0 8px",
            }}
            className="hidden sm:block"
          />

          {/* Small stat inline */}
          <div
            style={{ display: "flex", gap: "24px" }}
            className="hidden sm:flex"
          >
            {[
              { value: "750+", label: "Members" },
              { value: "9", label: "Committees" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#00629B",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
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

        {/* Bottom Meta Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {committees.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              to={`/committee/${c.id}`}
              className="tech-tag"
              style={{ textDecoration: "none", cursor: "pointer", transition: "border-color 0.2s ease, color 0.2s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,98,155,0.6)";
                e.currentTarget.style.color = "#00629B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(235,211,169,0.2)";
                e.currentTarget.style.color = "rgba(235,211,169,0.6)";
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
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
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
