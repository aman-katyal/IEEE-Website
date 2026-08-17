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
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center py-32 px-6 bg-[var(--boiler-black)]">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
          {error ? "Error Loading Committee" : "Committee Not Found"}
        </h1>
        <p className="font-[family-name:var(--font-body)] text-base text-[var(--text-secondary)] mb-8 max-w-md">
          {error
            ? error.message
            : "The committee you're looking for doesn't exist or may have been moved."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[var(--electric-blue)] no-underline font-[family-name:var(--font-body)] text-sm font-semibold tracking-wider uppercase hover:underline"
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
      <section className="bg-[var(--boiler-black)] pt-10 pb-28 relative">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Facts Bento Bar: Key Metrics, Leadership Contact, Join Action */}
          <CommitteeQuickFacts
            committee={committee}
            loading={loading}
            isLight={isLight}
          />

          <div className="flex flex-col gap-14">
            {/* About This Committee Card */}
            {committee?.longDescription && (
              <Skeleton
                name="committee-about"
                loading={loading}
                color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
              >
                <div>
                  <p className="section-eyebrow mb-4">
                    // About This Committee
                  </p>
                  <div
                    className={`glass-card p-6 sm:p-9 ${
                      isLight ? "bg-white/70" : "bg-black/20"
                    }`}
                  >
                    <div className="font-[family-name:var(--font-body)] text-base text-[var(--text-secondary)] leading-loose">
                      <ReactMarkdown>{committee.longDescription}</ReactMarkdown>
                    </div>

                    {committee?.tags && committee.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-6 pt-4 border-t border-[var(--glass-border)]">
                        {committee.tags.map((tag) => (
                          <span
                            key={tag}
                            className="tech-tag py-1 px-2.5 text-xs"
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
