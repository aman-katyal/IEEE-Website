import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "boneyard-js/react";
import { ExternalLink, Tag, Sparkles } from "lucide-react";
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
      <div className="flex flex-col gap-12">
        {sections.map((section, idx) => {
          if (section.type !== "projects") return null;
          const projCrop = section.imageStyle?.crop !== false;

          return (
            <div key={idx}>
              <p className="section-eyebrow mb-5">
                // {section.title || "Featured Projects"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items?.map((project, pIdx) => {
                  const cardDescription = project.shortDescription || project.description;
                  const projectLink = project.url || project.link;

                  return (
                    <div
                      key={pIdx}
                      className={`glass-card transition-all duration-300 hover:scale-[1.02] hover:border-[var(--electric-blue)] flex flex-col overflow-hidden cursor-pointer group ${
                        isLight ? "bg-white/70" : "bg-black/25"
                      }`}
                      onClick={() => setSelectedProject(project)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedProject(project)}
                    >
                      {project.image && (
                        <div className="h-48 w-full border-b border-[var(--glass-border)] overflow-hidden relative bg-black/10">
                          <img
                            src={project.image}
                            alt={project.name}
                            className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                              projCrop ? "object-cover" : "object-contain"
                            }`}
                          />
                          {projectLink && (
                            <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-[var(--electric-blue)] opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink size={12} />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-2.5 flex-wrap gap-1.5">
                          <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[var(--text-primary)] m-0 group-hover:text-[var(--electric-blue)] transition-colors">
                            {project.name}
                          </h3>

                          {project.flagship && (
                            <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded bg-[rgba(235,211,169,0.12)] border border-[rgba(235,211,169,0.35)] text-[var(--cyber-gold)] font-[family-name:var(--font-mono)] text-[0.6rem] font-bold tracking-wider">
                              ★ Flagship
                            </span>
                          )}
                        </div>

                        {cardDescription && (
                          <div className="font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3 flex-1">
                            <ReactMarkdown>{cardDescription}</ReactMarkdown>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--glass-border)]">
                          {/* Tech stack / tags */}
                          {project.tags && project.tags.length > 0 ? (
                            <div className="flex gap-1.5 flex-wrap">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="font-[family-name:var(--font-mono)] text-[0.6rem] text-[var(--text-muted)] inline-flex items-center gap-0.5"
                                >
                                  <Tag size={9} />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[var(--electric-blue)] group-hover:underline">
                              View details →
                            </span>
                          )}

                          {projectLink && (
                            <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--cyber-gold)] flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <ExternalLink size={10} /> Link
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Lightbox & Scrollable Modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col bg-[var(--boiler-black)] border-[var(--glass-border)] text-[var(--text-primary)] p-6 sm:p-8 rounded-xl shadow-2xl custom-scrollbar">
          {selectedProject && (
            <div className="flex flex-col gap-4">
              <DialogHeader>
                <div className="flex items-center justify-between gap-3 pr-6 flex-wrap">
                  <DialogTitle className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                    {selectedProject.name}
                  </DialogTitle>
                  {selectedProject.flagship && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[rgba(235,211,169,0.15)] border border-[rgba(235,211,169,0.4)] text-[var(--cyber-gold)] font-[family-name:var(--font-mono)] text-xs font-bold">
                      <Sparkles size={12} /> Flagship Project
                    </span>
                  )}
                </div>
              </DialogHeader>

              {/* Project Image */}
              {selectedProject.image && (
                <div className="w-full max-h-80 sm:max-h-96 rounded-lg overflow-hidden my-1 border border-[var(--glass-border)] bg-black/30 flex items-center justify-center">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="w-full h-full max-h-96 object-contain"
                  />
                </div>
              )}

              {/* Tags Pill Row */}
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tech-tag text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Project Detailed Description */}
              <DialogDescription asChild>
                <div className="font-[family-name:var(--font-body)] text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed space-y-3 pt-2">
                  <ReactMarkdown>
                    {selectedProject.longDescription || selectedProject.description}
                  </ReactMarkdown>
                </div>
              </DialogDescription>

              {/* Prominent Action Link to Full/Longer Project Page */}
              {(selectedProject.url || selectedProject.link) && (
                <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between gap-4 flex-wrap bg-white/[0.02] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:p-6 rounded-b-xl">
                  <div className="flex flex-col">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                      Full Project Documentation
                    </span>
                    <span className="font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)]">
                      Explore detailed specs, repositories, or full write-up
                    </span>
                  </div>
                  <a
                    href={selectedProject.url || selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 py-2.5 px-5 text-xs font-semibold font-[family-name:var(--font-mono)] uppercase tracking-wider cursor-pointer hover:shadow-lg transition-all"
                  >
                    Open Project Page <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Skeleton>
  );
}
