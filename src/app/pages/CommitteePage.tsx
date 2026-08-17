import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "boneyard-js/react";
import { useCommittee } from "../../hooks/useSanityData";
import { CommitteeHeader } from "../components/committees/CommitteeHeader";
import { CommitteeQuickFacts } from "../components/committees/CommitteeQuickFacts";
import { CommitteeProjects } from "../components/committees/CommitteeProjects";
import { CommitteeGallery } from "../components/committees/CommitteeGallery";
import { CommitteeContentSections } from "../components/committees/CommitteeContentSections";
import type { CommitteeSection } from "../../data/committees/types";

export function CommitteePage() {
  const { id } = useParams<{ id: string }>();
  const { committee, loading, error } = useCommittee(id || "");
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!loading && (error || !committee)) {
    return (
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px",
          background: "var(--boiler-black)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "48px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        >
          {error ? "Error Loading Committee" : "Committee Not Found"}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            color: "var(--text-secondary)",
            marginBottom: "32px",
          }}
        >
          {error
            ? error.message
            : "The committee you're looking for doesn't exist or may have been moved."}
        </p>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--electric-blue)",
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </section>
    );
  }

  // Partition sections by category
  const rawSections: CommitteeSection[] = committee?.sections || [];
  const textSections = rawSections.filter((s) => s.type === "text" || !s.type);
  const projectsSections = rawSections.filter((s) => s.type === "projects");
  const gallerySections = rawSections.filter((s) => s.type === "gallery");
  const historySections = rawSections.filter((s) => s.type === "history" || s.type === "timeline");
  const faqAndContactSections = rawSections.filter((s) => s.type === "faq" || s.type === "contact");

  return (
    <>
      {/* Hero Banner with Title, Tagline, Est. Year, Breadcrumbs */}
      <CommitteeHeader
        committee={committee}
        loading={loading}
        isLight={isLight}
      />

      {/* Main Content Area: Centered, Full-Width Layout */}
      <section
        style={{
          background: "var(--boiler-black)",
          padding: "40px 0 120px",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
          }}
        >
          {/* Quick Facts Bento Bar: Key Metrics, Leadership Contact, Join Action */}
          <CommitteeQuickFacts
            committee={committee}
            loading={loading}
            isLight={isLight}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
            {/* About This Committee Card */}
            {committee?.longDescription && (
              <Skeleton
                name="committee-about"
                loading={loading}
                color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
              >
                <div>
                  <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                    // About This Committee
                  </p>
                  <div
                    className="glass-card"
                    style={{
                      padding: "clamp(24px, 4vw, 36px)",
                      background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "15.5px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.85,
                      }}
                    >
                      <ReactMarkdown>{committee.longDescription}</ReactMarkdown>
                    </div>

                    {committee?.tags && committee.tags.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginTop: "24px",
                          paddingTop: "16px",
                          borderTop: "1px solid var(--glass-border)",
                        }}
                      >
                        {committee.tags.map((tag) => (
                          <span
                            key={tag}
                            className="tech-tag"
                            style={{
                              opacity: isLight ? 1 : 0.9,
                              padding: "4px 10px",
                              fontSize: "0.7rem",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Skeleton>
            )}

            {/* Custom Text / Subteams Sections */}
            {textSections.length > 0 && (
              <CommitteeContentSections
                sections={textSections}
                isLight={isLight}
              />
            )}

            {/* Featured Projects Grid */}
            {projectsSections.length > 0 && (
              <CommitteeProjects
                sections={projectsSections}
                loading={loading}
                isLight={isLight}
              />
            )}

            {/* History & Milestones Timeline */}
            {historySections.length > 0 && (
              <CommitteeContentSections
                sections={historySections}
                isLight={isLight}
              />
            )}

            {/* Media Gallery */}
            {gallerySections.length > 0 && (
              <CommitteeGallery
                sections={gallerySections}
                loading={loading}
                isLight={isLight}
              />
            )}

            {/* FAQs & Contact Channels */}
            {faqAndContactSections.length > 0 && (
              <CommitteeContentSections
                sections={faqAndContactSections}
                isLight={isLight}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
