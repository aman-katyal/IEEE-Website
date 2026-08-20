import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Link } from "react-router";
import { Shield, Lock, Users, Camera, Mail, ArrowLeft } from "lucide-react";

export function PrivacyPage() {
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
            // Legal & Privacy
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
            Privacy <span style={{ color: "var(--electric-blue)" }}>Policy</span>
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

        {/* Policy Content Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Section 1: Overview */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Shield size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                1. Overview & Commitment
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              The Purdue University IEEE Student Branch (&quot;Purdue IEEE&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy of our members, students, alumni, corporate partners, and site visitors. As a student organization affiliated with IEEE Region 4 and Purdue University, we collect only the minimum necessary information required to coordinate club projects, workshops, general meetings, and community communications.
            </p>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Users size={22} style={{ color: "var(--cyber-gold)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                2. Information Collection & Usage
              </h2>
            </div>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p>We may collect basic personal information when you interact with our branch through the following channels:</p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li><strong>Membership Registration:</strong> Name, Purdue email address (@purdue.edu), major, academic standing, and technical committee interests.</li>
                <li><strong>Community Discord & Mailing Lists:</strong> Discord user identifier and mailing list subscriptions used exclusively for official IEEE announcements.</li>
                <li><strong>Event Sign-Ins & Attendance:</strong> Callout rosters and technical workshop check-ins used for branch activity metrics and university reporting.</li>
              </ul>
              <p style={{ marginTop: "4px" }}>
                <strong>We never sell, rent, or trade your personal information.</strong> Data is used solely for branch administration, committee coordination, and university compliance.
              </p>
            </div>
          </div>

          {/* Section 3: Financial & Payment Processing */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Lock size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                3. Financial Security & Dues Processing
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              Purdue IEEE does not store, process, or transmit credit card or banking details directly on our servers. All branch dues, competition fees, and merchandise transactions are securely routed through Purdue University&apos;s Business Office for Student Organizations (BOSSO) and official Touchnet/EPAY gateway systems.
            </p>
          </div>

          {/* Section 4: Media & Event Photography */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Camera size={22} style={{ color: "var(--cyber-gold)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                4. Media & Event Photography
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              Photographs and video recordings may be captured during public IEEE general meetings, social events, outreach programs, and competitions. Media may be published on the Purdue IEEE website, official social channels, or annual reports to showcase member accomplishments. If you wish to have a specific photograph removed, please contact our webmaster or executive committee.
            </p>
          </div>

          {/* Section 5: Contact & Governance */}
          <div className="glass-card" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Mail size={22} style={{ color: "var(--electric-blue)" }} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
                5. Questions & Contact Information
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "16px" }}>
              For inquiries regarding this Privacy Policy, your personal data, or branch operations, please reach out to:
            </p>
            <div style={{ background: "rgba(0,0,0,0.25)", padding: "16px 20px", borderRadius: "8px", border: "1px solid var(--glass-border)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-primary)" }}>
              Purdue IEEE Student Branch<br />
              Electrical Engineering Building (EE 115 / EE 224)<br />
              Purdue University, West Lafayette, IN 47907<br />
              Email: <a href="mailto:ieee@purdue.edu" style={{ color: "var(--electric-blue)" }}>ieee@purdue.edu</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
