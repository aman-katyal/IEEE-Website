import { ExternalLink } from "lucide-react";
import { committees } from "../../data/committees";

const benefits = [
  `Access to ${committees.length} technical committees`,
  "Industry networking & recruitment events",
  "Hands-on workshops & training",
  "National competition opportunities",
  "Research lab access & mentorship",
  "IEEE Student Membership discount",
];

export function JoinCTA() {
  return (
    <section
      id="join"
      style={{
        background: "#001E3C",
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
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              fontWeight: 700,
              color: "#F8F9FA",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              marginBottom: "24px",
            }}
          >
            Ready to{" "}
            <span
              style={{
                color: "#EBD3A9",
              }}
            >
              Build
            </span>{" "}
            Something{" "}
            <span style={{ color: "#00629B" }}>Real?</span>
          </h2>
          <p
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "16px",
              color: "rgba(248,249,250,0.55)",
              lineHeight: 1.75,
              marginBottom: "36px",
            }}
          >
            Join Purdue IEEE and gain access to world-class engineering teams, 
            cutting-edge facilities, and a community that's shaping the future 
            of technology.
          </p>

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
                    background: "#00629B",
                    borderRadius: "50%",
                    marginTop: "6px",
                    flexShrink: 0,
                    boxShadow: "0 0 6px rgba(0,98,155,0.8)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
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
                viewBox="0 0 127.14 96.36" 
                fill="#5865F2"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.78,56.63.48,80.21a105.73,105.73,0,0,0,32.21,16.15,11.58,11.58,0,0,0,6.62-3.83,74,74,0,0,0,5.4-11,8,8,0,0,0-4.38-4,74.15,74.15,0,0,1-10.4-4.83,7.91,7.91,0,0,1-.46-12.86,4.78,4.78,0,0,1,.6-.44c.48-.33,1-.65,1.48-1,1.52-1,3.22-2,4.87-2.88,1.46-.78,3-1.5,4.52-2.16a107.56,107.56,0,0,1,19.34-6.42A107.56,107.56,0,0,1,82.47,32.1a107.56,107.56,0,0,1,19.34,6.42c1.54.66,3.06,1.38,4.52,2.16,1.65.88,3.35,1.9,4.87,2.88.49.32,1,.64,1.48,1a4.78,4.78,0,0,1,.6.44,7.91,7.91,0,0,1-.46,12.86,74.15,74.15,0,0,1-10.4,4.83,8,8,0,0,0-4.38,4,74,74,0,0,0,5.4,11,11.58,11.58,0,0,0,6.62,3.83,105.73,105.73,0,0,0,32.21-16.15C129.28,56.63,124.79,32.65,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.07-12.66,11.41-12.66S54,46,54,53,48.83,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.07-12.66,11.41-12.66S96.14,46,96.14,53,91,65.69,84.69,65.69Z"/>
              </svg>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#F8F9FA",
                  lineHeight: 1.2,
                  marginBottom: "12px"
                }}
              >
                Join the Community
              </h3>
              <p
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
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
                fontFamily: "'IBM Plex Mono', monospace",
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
