import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Link } from "react-router";
import { Accessibility, CheckCircle2, Eye, Mail, ArrowLeft, ExternalLink } from "lucide-react";

export function AccessibilityPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            // Commitment & Standards
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
            Accessibility <span style={{ color: "var(--electric-blue)" }}>Statement</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            Conformance Target: WCAG 2.2 Level AA · Purdue IEEE Student Branch
          </p>
        </div>

        {/* Accessibility Content Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Section 1: Statement */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Accessibility size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                1. Our Commitment
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              Purdue IEEE is committed to ensuring digital accessibility for people of all abilities. We continually apply relevant accessibility standards to improve the user experience for everyone, adhering to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.
            </p>
          </div>

          {/* Section 2: Features */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <CheckCircle2 size={22} style={{ color: "var(--cyber-gold)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                2. Key Accessibility Features
              </h2>
            </div>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li><strong>Keyboard Navigation:</strong> All interactive components, dropdown menus, modals, and tabs are fully operable via keyboard with visible focus rings.</li>
                <li><strong>Skip Links:</strong> A built-in &quot;Skip to main content&quot; shortcut is provided for keyboard and screen reader users on every page.</li>
                <li><strong>Semantic Structure:</strong> Pages use standard HTML5 landmarks (<code style={{ color: "var(--electric-blue)" }}>&lt;main&gt;</code>, <code style={{ color: "var(--electric-blue)" }}>&lt;nav&gt;</code>, <code style={{ color: "var(--electric-blue)" }}>&lt;header&gt;</code>, <code style={{ color: "var(--electric-blue)" }}>&lt;footer&gt;</code>) and proper ARIA states (<code style={{ color: "var(--electric-blue)" }}>aria-expanded</code>, <code style={{ color: "var(--electric-blue)" }}>aria-controls</code>).</li>
                <li><strong>Contrast Compliance:</strong> Text colors and visual elements are calibrated to maintain strong contrast ratios on our dark canvas.</li>
                <li><strong>Reduced Motion:</strong> Respects operating system <code style={{ color: "var(--electric-blue)" }}>prefers-reduced-motion</code> settings for animations.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Physical & Event Accommodations */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Eye size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                3. Physical Space & Event Accessibility
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "12px" }}>
              Purdue IEEE general meetings and committee workshops take place in wheelchair-accessible facilities within the Electrical Engineering Building (EE 115 / EE 224) and campus lecture halls. If you require accommodations for any in-person event, workshop, or competition, please reach out to our officers in advance.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              You may also consult the <a href="https://www.purdue.edu/drc/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyber-gold)", display: "inline-flex", alignItems: "center", gap: "4px" }}>Purdue Disability Resource Center (DRC) <ExternalLink size={12} /></a> for university-wide student resources.
            </p>
          </div>

          {/* Section 4: Feedback & Assistance */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Mail size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                4. Feedback & Contact
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "16px" }}>
              We welcome your feedback on the accessibility of the Purdue IEEE website. If you encounter any barriers or have suggestions for improvement, please contact us:
            </p>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: "16px 20px", borderRadius: "8px", border: "1px solid var(--glass-border)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>
              Purdue IEEE Webmaster & Executive Board<br />
              Email: <a href="mailto:ieee@purdue.edu" style={{ color: "var(--electric-blue)" }}>ieee@purdue.edu</a><br />
              Subject: Accessibility Feedback / Accommodation Request
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
