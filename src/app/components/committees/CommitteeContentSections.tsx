import React from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle, Mail } from "lucide-react";
import type { CommitteeSection } from "../../../data/committees/types";

interface CommitteeContentSectionsProps {
  sections: CommitteeSection[];
  isLight: boolean;
}

export function CommitteeContentSections({ sections, isLight }: CommitteeContentSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-14">
      {sections.map((section, index) => {
        switch (section.type) {
          case "text": {
            const layout = section.layout || "top";
            const isCrop = section.imageStyle?.crop !== false;

            return (
              <div key={index}>
                <p className="section-eyebrow mb-4">
                  // {section.title || "Information"}
                </p>
                <div
                  className={`glass-card p-6 sm:p-9 flex flex-wrap gap-8 items-start ${
                    layout === "top"
                      ? "flex-col"
                      : layout === "left"
                        ? "flex-row"
                        : "flex-row-reverse"
                  } ${
                    isLight ? "bg-white/70" : "bg-black/20"
                  }`}
                >
                  {section.image && (
                    <div
                      className={`w-full rounded-md overflow-hidden border border-[var(--glass-border)] bg-black/10 ${
                        layout === "top" ? "flex-1" : "flex-none max-w-lg"
                      }`}
                    >
                      <img
                        src={section.image}
                        alt={section.title}
                        className={`w-full h-auto max-h-[500px] block ${
                          isCrop ? "object-cover" : "object-contain"
                        }`}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-[280px] w-full max-w-full">
                    <div className="font-[family-name:var(--font-body)] text-base text-[var(--text-secondary)] leading-loose">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          case "faq": {
            return (
              <div key={index}>
                <p className="section-eyebrow mb-4">
                  // {section.title || "Frequently Asked Questions"}
                </p>
                <div className="flex flex-col gap-3">
                  {section.items?.map((faq, i) => (
                    <div
                      key={i}
                      className={`glass-card p-6 sm:p-8 ${
                        isLight ? "bg-white/70" : "bg-black/20"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2.5">
                        <MessageCircle
                          size={16}
                          className="text-[var(--electric-blue)] shrink-0 mt-0.5"
                        />
                        <h4 className="font-[family-name:var(--font-headline)] text-base font-semibold text-[var(--text-primary)] leading-snug m-0">
                          {faq.question}
                        </h4>
                      </div>
                      <div className="font-[family-name:var(--font-body)] text-sm text-[var(--text-secondary)] leading-relaxed pl-7 whitespace-pre-wrap">
                        <ReactMarkdown>{faq.answer}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          case "timeline":
          case "history": {
            return (
              <div key={index}>
                <p className="section-eyebrow mb-4">
                  // {section.title || "History & Milestones"}
                </p>
                <div className="flex flex-col gap-5 relative">
                  {section.items?.map((item, i) => (
                    <div
                      key={i}
                      className={`glass-card p-5 sm:p-7 ${
                        isLight ? "bg-white/70" : "bg-black/20"
                      }`}
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        {item.year && (
                          <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--cyber-gold)] tracking-wider">
                            {item.year}
                          </span>
                        )}
                        {item.title && (
                          <h4 className="font-[family-name:var(--font-headline)] text-base font-semibold text-[var(--text-primary)] m-0">
                            {item.title}
                          </h4>
                        )}
                      </div>
                      {item.description && (
                        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          case "contact": {
            return (
              <div key={index}>
                <p className="section-eyebrow mb-4">
                  // {section.title || "Get In Touch"}
                </p>
                <div
                  className={`glass-card p-7 sm:p-8 ${
                    isLight ? "bg-white/70" : "bg-black/20"
                  }`}
                >
                  {section.name && (
                    <h4 className="font-[family-name:var(--font-headline)] text-lg font-semibold text-[var(--text-primary)] mb-1">
                      {section.name}
                    </h4>
                  )}
                  {section.role && (
                    <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--cyber-gold)] uppercase mb-2 tracking-wider">
                      {section.role}
                    </p>
                  )}
                  {section.email && (
                    <a
                      href={`mailto:${section.email}`}
                      className="text-[var(--electric-blue)] no-underline text-sm inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] hover:underline"
                    >
                      <Mail size={14} /> {section.email}
                    </a>
                  )}
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
