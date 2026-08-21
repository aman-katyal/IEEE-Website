import { useTheme } from "next-themes";
import { Link } from "react-router";
import { FileText, ShieldAlert, Cpu, Award, ArrowLeft, ExternalLink } from "lucide-react";

export function TermsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

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
      {/* Background grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: isLight ? 0.4 : 0.25 }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 32px)",
        }}
      >
        {/* Breadcrumb back button */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.875rem",
            marginBottom: "32px",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <p className="section-eyebrow" style={{ marginBottom: "16px", opacity: isLight ? 1 : 0.9 }}>
            // Legal & Governance
          </p>
          <h1
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            Terms of <span style={{ color: "var(--electric-blue)" }}>Use</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            Effective Date: Spring Semester 2026 · Purdue IEEE Student Branch
          </p>
        </div>

        {/* Terms Content Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Section 1: Acceptance */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <FileText size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                1. Acceptance of Terms
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              By accessing or using the Purdue IEEE website (<a href="https://purdueieee.org" style={{ color: "var(--electric-blue)" }}>purdueieee.org</a>), participating in technical committee projects, or attending official branch events, you agree to comply with and be bound by these Terms of Use, our <Link to="/constitution" style={{ color: "var(--cyber-gold)" }}>Branch Constitution</Link>, and the official policies of Purdue University and the IEEE.
            </p>
          </div>

          {/* Section 2: Code of Conduct */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <ShieldAlert size={22} style={{ color: "var(--cyber-gold)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                2. Member Code of Conduct
              </h2>
            </div>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p>Purdue IEEE is dedicated to providing an inclusive, collaborative, and harassment-free experience for all members regardless of race, gender, background, major, or experience level. Members and visitors agree to:</p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>Foster an environment of mutual respect, safety, and constructive teamwork.</li>
                <li>Adhere strictly to the Purdue University Student Code of Honor and lab safety regulations.</li>
                <li>Refrain from abusive, discriminatory, or disruptive conduct in online forums (Discord) and physical workspaces (EE 115 / EE 224).</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Lab Access & Equipment Use */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Cpu size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                3. Lab & Equipment Access
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              Access to Purdue IEEE technical facilities, tools, 3D printers, soldering stations, and specialized hardware is reserved for active dues-paying members who have completed mandatory safety orientations. Equipment must be operated responsibly according to lab safety protocols and returned in good working order.
            </p>
          </div>

          {/* Section 4: Projects & Intellectual Property */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Award size={22} style={{ color: "var(--cyber-gold)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                4. Projects & Open Source
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "16px" }}>
              Codebases, hardware designs, and engineering documentation produced by technical committees are maintained under relevant open-source licenses or branch project guidelines. You may inspect and contribute to active projects via the <a href="https://github.com/PurdueIEEE" target="_blank" rel="noopener noreferrer" style={{ color: "var(--electric-blue)", display: "inline-flex", alignItems: "center", gap: "4px" }}>Purdue IEEE GitHub organization <ExternalLink size={12} /></a>.
            </p>
          </div>

          {/* Section 5: Governance */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
              5. Governance & Bylaws
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "16px" }}>
              Official branch governing documents, election rules, officer responsibilities, and committee bylaws are publicly available for review:
            </p>
            <Link
              to="/constitution"
              className="btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              <FileText size={16} /> View Branch Constitution & Bylaws
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
