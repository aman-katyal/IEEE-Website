import { useTheme } from "next-themes";
import { Link } from "react-router";
import { Accessibility, CheckCircle2, Eye, Mail, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSiteSettings } from "../../hooks/useSanityData";
import { usePageMeta } from "../../hooks/usePageMeta";
import type { LegalSection } from "../../data/sanity-types";

function getAccessibilityIcon(iconName?: string, index = 0) {
  switch (iconName?.toLowerCase()) {
    case "accessibility":
      return <Accessibility size={22} style={{ color: "var(--electric-blue)" }} />;
    case "check":
    case "features":
      return <CheckCircle2 size={22} style={{ color: "var(--cyber-gold)" }} />;
    case "eye":
    case "space":
      return <Eye size={22} style={{ color: "var(--electric-blue)" }} />;
    case "mail":
    case "contact":
      return <Mail size={22} style={{ color: "var(--electric-blue)" }} />;
    default:
      return index % 2 === 1 ? (
        <CheckCircle2 size={22} style={{ color: "var(--cyber-gold)" }} />
      ) : (
        <Accessibility size={22} style={{ color: "var(--electric-blue)" }} />
      );
  }
}

const DEFAULT_ACCESSIBILITY_SECTIONS: LegalSection[] = [
  {
    title: "1. Our Commitment",
    icon: "accessibility",
    content:
      "Purdue IEEE is committed to ensuring digital accessibility for people of all abilities. We continually apply relevant accessibility standards to improve the user experience for everyone, adhering to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.",
  },
  {
    title: "2. Key Accessibility Features",
    icon: "check",
    content:
      "- **Keyboard Navigation:** All interactive components, dropdown menus, modals, and tabs are fully operable via keyboard with visible focus rings.\n- **Skip Links:** A built-in \"Skip to main content\" shortcut is provided for keyboard and screen reader users on every page.\n- **Semantic Structure:** Pages use standard HTML5 landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`) and proper ARIA states (`aria-expanded`, `aria-controls`).\n- **Contrast Compliance:** Text colors and visual elements are calibrated to maintain strong contrast ratios on our dark canvas.\n- **Reduced Motion:** Respects operating system `prefers-reduced-motion` settings for animations.",
  },
  {
    title: "3. Physical Space & Event Accessibility",
    icon: "eye",
    content:
      "Purdue IEEE general meetings and committee workshops take place in wheelchair-accessible facilities within the Electrical Engineering Building (EE 115 / EE 224) and campus lecture halls. If you require accommodations for any in-person event, workshop, or competition, please reach out to our officers in advance.\n\nYou may also consult the [Purdue Disability Resource Center (DRC)](https://www.purdue.edu/drc/) for university-wide student resources.",
  },
  {
    title: "4. Feedback & Contact",
    icon: "mail",
    content:
      "We welcome your feedback on the accessibility of the Purdue IEEE website. If you encounter any barriers or have suggestions for improvement, please contact us:\n\n**Purdue IEEE Webmaster & Executive Board**  \nEmail: [ieee@purdue.edu](mailto:ieee@purdue.edu)  \nSubject: Accessibility Feedback / Accommodation Request",
  },
];

export function AccessibilityPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading } = useSiteSettings();

  usePageMeta({
    title: "Accessibility",
    description:
      "Accessibility statement and WCAG 2.2 Level AA conformance standards for the Purdue University IEEE Student Branch website.",
  });

  const pageTitle = settings?.accessibilityTitle || "Accessibility Statement";
  const conformanceTarget =
    settings?.accessibilityTarget ||
    "Conformance Target: WCAG 2.2 Level AA · Purdue IEEE Student Branch";
  const sections =
    settings?.accessibilitySections && settings.accessibilitySections.length > 0
      ? settings.accessibilitySections
      : DEFAULT_ACCESSIBILITY_SECTIONS;

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
            {pageTitle.includes("Statement") ? (
              <>
                {pageTitle.replace("Statement", "")}
                <span style={{ color: "var(--electric-blue)" }}>Statement</span>
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
            {conformanceTarget}
          </p>
        </div>

        {/* Accessibility Content Sections */}
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
                {getAccessibilityIcon(sec.icon, idx)}
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
