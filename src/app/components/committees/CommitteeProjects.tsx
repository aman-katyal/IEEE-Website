import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "boneyard-js/react";
import { ExternalLink, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import type { CommitteeSection, CommitteeProject } from "../../../data/committees/types";

interface CommitteeProjectsProps {
  sections: CommitteeSection[];
  loading: boolean;
  isLight: boolean;
}

export function CommitteeProjects({ sections, loading, isLight }: CommitteeProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<CommitteeProject | null>(null);

  if (!sections || sections.length === 0) return null;

  return (
    <Skeleton
      name="committee-projects"
      loading={loading}
      color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {sections.map((section, idx) => {
          if (section.type !== "projects") return null;
          const projCrop = section.imageStyle?.crop !== false;

          return (
            <div key={idx}>
              <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
                // {section.title || "Featured Projects"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items?.map((project, pIdx) => (
                  <div
                    key={pIdx}
                    className="glass-card transition-all duration-200 hover:scale-[1.02] hover:border-[var(--electric-blue)]"
                    onClick={() => setSelectedProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedProject(project)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      cursor: "pointer",
                      background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {project.image && (
                      <div
                        style={{
                          height: "190px",
                          width: "100%",
                          borderBottom: "1px solid var(--glass-border)",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={project.image}
                          alt={project.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: projCrop ? "cover" : "contain",
                            background: "rgba(0,0,0,0.05)",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: "var(--font-headline)",
                              fontSize: "18px",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              margin: 0,
                            }}
                          >
                            {project.name}
                          </h3>
                        </div>

                        {project.flagship && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: "rgba(235, 211, 169, 0.12)",
                              border: "1px solid rgba(235, 211, 169, 0.35)",
                              color: "var(--cyber-gold)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                            }}
                          >
                            ★ Flagship
                          </span>
                        )}
                      </div>

                      {project.description && (
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13.5px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.6,
                            marginBottom: "16px",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flex: 1,
                          }}
                        >
                          <ReactMarkdown>{project.description}</ReactMarkdown>
                        </div>
                      )}

                      {/* Tech stack / tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            marginTop: "auto",
                            paddingTop: "12px",
                            borderTop: "1px solid var(--glass-border)",
                          }}
                        >
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.6rem",
                                color: "var(--text-muted)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Lightbox Modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent className="max-w-2xl bg-[var(--boiler-black)] border-[var(--glass-border)] text-[var(--text-primary)]">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-3 pr-6">
                  <DialogTitle className="font-[family-name:var(--font-headline)] text-2xl font-bold text-[var(--text-primary)]">
                    {selectedProject.name}
                  </DialogTitle>
                  {selectedProject.flagship && (
                    <span className="px-2 py-0.5 rounded bg-[rgba(235,211,169,0.15)] border border-[rgba(235,211,169,0.4)] text-[var(--cyber-gold)] font-mono text-xs font-bold">
                      ★ Flagship
                    </span>
                  )}
                </div>
              </DialogHeader>

              {selectedProject.image && (
                <div className="w-full h-72 rounded-lg overflow-hidden my-3 border border-[var(--glass-border)]">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <DialogDescription className="font-[family-name:var(--font-body)] text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                <ReactMarkdown>{selectedProject.description}</ReactMarkdown>
              </DialogDescription>

              {selectedProject.url && (
                <div className="mt-4 pt-3 border-t border-[var(--glass-border)]">
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--electric-blue)] font-mono hover:underline"
                  >
                    View Project Link <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Skeleton>
  );
}
