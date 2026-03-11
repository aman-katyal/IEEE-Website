import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

export function About() {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      style={{
        background: "var(--deep-space-blue)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.4 }}
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
        <div className="ieee-grid-2" style={{ alignItems: "center" }}>
          <div>
            <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
              // Overview
            </p>
            <h2
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: "var(--stellar-white)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "24px",
              }}
            >
              At Purdue, we strive to be the <span style={{ color: "var(--electric-blue)" }}>best</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                color: "rgba(248,249,250,0.6)",
                lineHeight: 1.75,
                marginBottom: "32px",
              }}
            >
              Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. 
              Purdue IEEE is the university's largest technical organization, where students from all backgrounds 
              work on real-world problems and advance their engineering skills.
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("/about")}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              Learn More About Us
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="glass-card" style={{ padding: "48px", background: "rgba(0, 98, 155, 0.1)", textAlign: "center" }}>
             <div style={{ fontSize: "64px", fontWeight: 700, color: "var(--electric-blue)", fontFamily: "var(--font-headline)", marginBottom: "8px" }}>1903</div>
             <p style={{ color: "var(--cyber-gold)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "12px", fontFamily: "var(--font-mono)" }}>Established & Innovating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
