import { Mail, Users, User } from "lucide-react";
import { leaders } from "../../data/leadership";

export function OfficersPage() {
  return (
    <section
      style={{
        background: "var(--boiler-black)",
        minHeight: "100vh",
        padding: "120px 0 96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.25 }}
      />

      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,98,155,0.6) 30%, rgba(235,211,169,0.4) 50%, rgba(0,98,155,0.6) 70%, transparent 100%)",
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
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "72px",
            textAlign: "center",
          }}
        >
          <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
            // Leadership Team
          </p>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--stellar-white)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "24px",
            }}
          >
            Meet Our <span style={{ color: "var(--electric-blue)" }}>Officers</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "rgba(248,249,250,0.6)",
              lineHeight: 1.6,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            The dedicated students who keep Purdue IEEE running smoothly across all
            technical and administrative operations.
          </p>
        </div>

        {/* Officers Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {leaders.map((officer) => (
            <div
              key={officer.name + officer.role}
              style={{
                background: "rgba(0, 30, 60, 0.4)", // Deep blue tinted background
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(0, 98, 155, 0.2)",
                borderRadius: "8px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--electric-blue)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 98, 155, 0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(0, 98, 155, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Image Placeholder / Container */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "4px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(0, 98, 155, 0.1)",
                  overflow: "hidden"
                }}
              >
                {officer.image ? (
                  <img 
                    src={officer.image} 
                    alt={officer.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={48} style={{ color: "rgba(0, 98, 155, 0.3)" }} />
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--stellar-white)",
                    marginBottom: "6px",
                  }}
                >
                  {officer.name}
                </h3>
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    background: "rgba(0, 98, 155, 0.2)",
                    border: "1px solid rgba(0, 98, 155, 0.4)",
                    borderRadius: "2px",
                    color: "var(--stellar-white)",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {officer.role}
                </div>
              </div>

              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                {officer.committees && (
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <Users size={15} style={{ color: "var(--cyber-gold)", marginTop: "3px", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(248, 249, 250, 0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Committees
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(248, 249, 250, 0.7)", lineHeight: 1.5 }}>
                        {officer.committees}
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <Mail size={15} style={{ color: "var(--electric-blue)", marginTop: "3px", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(248, 249, 250, 0.3)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Contact
                    </p>
                    <a
                      href={`mailto:${officer.email}`}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "rgba(248, 249, 250, 0.7)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "var(--electric-blue)")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "rgba(248, 249, 250, 0.7)")}
                    >
                      {officer.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
