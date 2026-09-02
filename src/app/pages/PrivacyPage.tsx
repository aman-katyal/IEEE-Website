import { useTheme } from "next-themes";
import { Link } from "react-router";
import { Shield, Lock, Users, Camera, Mail, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSiteSettings } from "../../hooks/useSanityData";
import { usePageMeta } from "../../hooks/usePageMeta";
import type { LegalSection } from "../../data/sanity-types";

function getPrivacyIcon(iconName?: string, index = 0) {
  switch (iconName?.toLowerCase()) {
    case "shield":
      return <Shield size={22} style={{ color: "var(--electric-blue)" }} />;
    case "users":
      return <Users size={22} style={{ color: "var(--cyber-gold)" }} />;
    case "lock":
      return <Lock size={22} style={{ color: "var(--electric-blue)" }} />;
    case "camera":
      return <Camera size={22} style={{ color: "var(--cyber-gold)" }} />;
    case "mail":
      return <Mail size={22} style={{ color: "var(--electric-blue)" }} />;
    default:
      return index % 2 === 1 ? (
        <Users size={22} style={{ color: "var(--cyber-gold)" }} />
      ) : (
        <Shield size={22} style={{ color: "var(--electric-blue)" }} />
      );
  }
}

const DEFAULT_PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Overview & Commitment",
    icon: "shield",
    content:
      "The Purdue University IEEE Student Branch (\"Purdue IEEE\", \"we\", \"us\", or \"our\") is committed to protecting the privacy of our members, students, alumni, corporate partners, and site visitors. As a student organization affiliated with IEEE Region 4 and Purdue University, we collect only the minimum necessary information required to coordinate club projects, workshops, general meetings, and community communications.",
  },
  {
    title: "2. Information Collection & Usage",
    icon: "users",
    content:
      "We may collect basic personal information when you interact with our branch through the following channels:\n\n- **Membership Registration:** Name, Purdue email address (`@purdue.edu`), major, academic standing, and technical committee interests.\n- **Community Discord & Mailing Lists:** Discord user identifier and mailing list subscriptions used exclusively for official IEEE announcements.\n- **Event Sign-Ins & Attendance:** Callout rosters and technical workshop check-ins used for branch activity metrics and university reporting.\n\n**We never sell, rent, or trade your personal information.** Data is used solely for branch administration, committee coordination, and university compliance.",
  },
  {
    title: "3. Financial Security & Dues Processing",
    icon: "lock",
    content:
      "Purdue IEEE does not store, process, or transmit credit card or banking details directly on our servers. All branch dues, competition fees, and merchandise transactions are securely routed through Purdue University's Business Office for Student Organizations (BOSSO) and official TooCOOL/TouchNet gateway systems.",
  },
  {
    title: "4. Media & Event Photography",
    icon: "camera",
    content:
      "Photographs and video recordings may be captured during public IEEE general meetings, social events, outreach programs, and competitions. Media may be published on the Purdue IEEE website, official social channels, or annual reports to showcase member accomplishments. If you wish to have a specific photograph removed, please contact our webmaster or executive committee.",
  },
  {
    title: "5. Questions & Contact Information",
    icon: "mail",
    content:
      "For inquiries regarding this Privacy Policy, your personal data, or branch operations, please reach out to:\n\n**Purdue IEEE Student Branch**  \nElectrical Engineering Building (EE 014 / EE 115)  \nPurdue University, West Lafayette, IN 47907  \nEmail: [ieee@purdue.edu](mailto:ieee@purdue.edu)",
  },
];

export function PrivacyPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading } = useSiteSettings();

  usePageMeta({
    title: "Privacy Policy",
    description:
      "Privacy policy and data governance practices for the Purdue University IEEE Student Branch.",
  });

  const pageTitle = settings?.privacyTitle || "Privacy Policy";
  const effectiveDate =
    settings?.privacyEffectiveDate ||
    "Effective Date: Spring Semester 2026 · Purdue IEEE Student Branch";
  const sections =
    settings?.privacySections && settings.privacySections.length > 0
      ? settings.privacySections
      : DEFAULT_PRIVACY_SECTIONS;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "var(--boiler-black)",
          color: "var(--text-primary)",
        }}
      >
        Loading...
      </div>
    );
  }

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
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")
          }
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <p
            className="section-eyebrow"
            style={{ marginBottom: "16px", opacity: isLight ? 1 : 0.9 }}
          >
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
            {pageTitle.includes("Policy") ? (
              <>
                {pageTitle.replace("Policy", "")}
                <span style={{ color: "var(--electric-blue)" }}>Policy</span>
              </>
            ) : (
              pageTitle
            )}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            {effectiveDate}
          </p>
        </div>

        {/* Policy Content Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {sections.map((sec, idx) => (
            <div
              key={sec._key || idx}
              className="glass-card"
              style={{ padding: "clamp(24px, 4vw, 36px)" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                {getPrivacyIcon(sec.icon, idx)}
                <h2
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {sec.title}
                </h2>
              </div>
              <div
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                <ReactMarkdown>{sec.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
