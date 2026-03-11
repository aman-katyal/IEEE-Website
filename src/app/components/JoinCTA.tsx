import { ExternalLink, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { committees } from "../../data/committees";
import { MagneticButton } from "./MagneticButton";

const benefits = [
  `Access to ${committees.length} technical committees`,
  "Industry networking & recruitment events",
  "Hands-on workshops & training",
  "National competition opportunities",
  "Research lab access & mentorship",
  "IEEE Student Membership discount",
];

export function JoinCTA() {
  const navigate = useNavigate();
  
  return (
    <section
      id="join"
      style={{
        background: "var(--boiler-black)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid overlay */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.5 }}
      />

      {/* Glow */}
      <div
        className="electric-glow-orb"
        style={{
          width: "900px",
          height: "400px",
          bottom: "-100px",
          right: "-100px",
          background:
            "radial-gradient(ellipse, rgba(0,98,155,0.18) 0%, transparent 65%)",
        }}
      />
      <div
        className="electric-glow-orb"
        style={{
          width: "500px",
          height: "500px",
          top: "-100px",
          left: "-50px",
          background:
            "radial-gradient(circle, rgba(235,211,169,0.05) 0%, transparent 65%)",
        }}
      />

      {/* Top / bottom borders */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,98,155,0.6), rgba(235,211,169,0.4), rgba(0,98,155,0.6), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,98,155,0.4), transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
        className="ieee-grid-join"
      >
        {/* Left content */}
        <div>
          <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
            // Membership
          </p>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              fontWeight: 700,
              color: "var(--stellar-white)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              marginBottom: "24px",
            }}
          >
            Ready to{" "}
            <span
              style={{
                color: "var(--cyber-gold)",
              }}
            >
              Build
            </span>{" "}
            Something{" "}
            <span style={{ color: "var(--electric-blue)" }}>Real?</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "rgba(248,249,250,0.55)",
              lineHeight: 1.75,
              marginBottom: "32px",
            }}
          >
            Join Purdue IEEE and gain access to world-class engineering teams, 
            cutting-edge facilities, and a community that's shaping the future 
            of technology.
          </p>

          <MagneticButton
            className="btn-primary"
            onClick={() => navigate("/join")}
            style={{
              marginBottom: "48px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "fit-content"
            }}
          >
            Join IEEE
            <ChevronRight size={16} />
          </MagneticButton>

          {/* Benefits list */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 24px",
            }}
          >
            {benefits.map((b) => (
              <div
                key={b}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    background: "var(--electric-blue)",
                    borderRadius: "50%",
                    marginTop: "6px",
                    flexShrink: 0,
                    boxShadow: "0 0 6px rgba(0,98,155,0.8)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13.5px",
                    color: "rgba(248,249,250,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Sign-up Discord */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            className="glass-card"
            style={{ 
              padding: "48px", 
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              width: "100%",
              maxWidth: "440px"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(88, 101, 242, 0.1)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px"
              }}
            >
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="#5865F2"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
              </svg>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "var(--stellar-white)",
                  lineHeight: 1.2,
                  marginBottom: "12px"
                }}
              >
                Join the Community
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "rgba(248,249,250,0.5)",
                  lineHeight: 1.6
                }}
              >
                Our Discord server is the central hub for all committee 
                updates, event announcements, and technical discussions.
              </p>
            </div>

            <a
              href="https://discord.gg/sPPQequ9ws"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                textDecoration: "none",
                background: "#5865F2",
                borderColor: "#5865F2"
              }}
            >
              <ExternalLink size={18} />
              Jump into Discord
            </a>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                color: "rgba(248,249,250,0.2)",
                textAlign: "center",
                letterSpacing: "0.08em",
                textTransform: "uppercase"
              }}
            >
              IEEE PURDUE · EST. 1903 · WELCOMING ALL MAJORS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
