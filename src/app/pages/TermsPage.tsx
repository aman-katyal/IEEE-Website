import { useTheme } from "next-themes";
import { Link } from "react-router";
import { FileText, ShieldAlert, Cpu, Award, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSiteSettings } from "../../hooks/useSanityData";
import { usePageMeta } from "../../hooks/usePageMeta";
import type { LegalSection } from "../../data/sanity-types";

function getTermsIcon(iconName?: string, index = 0) {
  switch (iconName?.toLowerCase()) {
    case "file":
    case "acceptance":
      return <FileText size={22} style={{ color: "var(--electric-blue)" }} />;
    case "shield":
    case "conduct":
      return <ShieldAlert size={22} style={{ color: "var(--cyber-gold)" }} />;
    case "cpu":
    case "lab":
      return <Cpu size={22} style={{ color: "var(--electric-blue)" }} />;
    case "award":
    case "ip":
      return <Award size={22} style={{ color: "var(--cyber-gold)" }} />;
    default:
      return index % 2 === 1 ? (
        <ShieldAlert size={22} style={{ color: "var(--cyber-gold)" }} />
      ) : (
        <FileText size={22} style={{ color: "var(--electric-blue)" }} />
      );
  }
}

const DEFAULT_TERMS_SECTIONS: LegalSection[] = [
  {
    title: "1. Acceptance of Terms",
    icon: "file",
    content:
      "By accessing or using the Purdue IEEE website ([purdueieee.org](https://purdueieee.org)), participating in technical committee projects, or attending official branch events, you agree to comply with and be bound by these Terms of Use, our [Branch Constitution](/constitution), and the official policies of Purdue University and the IEEE.",
  },
  {
    title: "2. Member Code of Conduct",
    icon: "shield",
    content:
      "Purdue IEEE is dedicated to providing an inclusive, collaborative, and harassment-free experience for all members regardless of race, gender, background, major, or experience level. Members and visitors agree to:\n\n- Foster an environment of mutual respect, safety, and constructive teamwork.\n- Adhere strictly to the Purdue University Student Code of Honor and lab safety regulations.\n- Refrain from abusive, discriminatory, or disruptive conduct in online forums (Discord) and physical workspaces (EE 014 / EE 115 / EE 224).",
  },
  {
    title: "3. Lab & Equipment Access",
    icon: "cpu",
    content:
      "Access to Purdue IEEE technical facilities, tools, 3D printers, soldering stations, and specialized hardware is reserved for active dues-paying members who have completed mandatory safety orientations. Equipment must be operated responsibly according to lab safety protocols and returned in good working order.",
  },
  {
    title: "4. Projects & Open Source",
    icon: "award",
    content:
      "Codebases, hardware designs, and engineering documentation produced by technical committees are maintained under relevant open-source licenses or branch project guidelines. You may inspect and contribute to active projects via the [Purdue IEEE GitHub organization](https://github.com/PurdueIEEE).",
  },
  {
    title: "5. Governance & Bylaws",
    icon: "file",
    content:
      "Official branch governing documents, election rules, officer responsibilities, and committee bylaws are publicly available for review on our [Constitution and Bylaws](/constitution) page.",
  },
];

export function TermsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading } = useSiteSettings();

  usePageMeta({
    title: "Terms of Use",
    description:
      "Terms of use, member code of conduct, and lab policies for the Purdue University IEEE Student Branch.",
  });

  const pageTitle = settings?.termsTitle || "Terms of Use";
  const effectiveDate =
    settings?.termsEffectiveDate ||
    "Effective Date: Spring Semester 2026 · Purdue IEEE Student Branch";
  const sections =
    settings?.termsSections && settings.termsSections.length > 0
      ? settings.termsSections
      : DEFAULT_TERMS_SECTIONS;

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
            {pageTitle.includes("Use") ? (
              <>
                {pageTitle.replace("Use", "")}
                <span style={{ color: "var(--electric-blue)" }}>Use</span>
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

        {/* Terms Content Sections */}
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
                {getTermsIcon(sec.icon, idx)}
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
