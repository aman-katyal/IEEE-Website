import React from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle, Mail, Clock } from "lucide-react";
import type { CommitteeSection } from "../../../data/committees/types";

interface CommitteeContentSectionsProps {
  sections: CommitteeSection[];
  isLight: boolean;
}

export function CommitteeContentSections({ sections, isLight }: CommitteeContentSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
      {sections.map((section, index) => {
        switch (section.type) {
          case "text": {
            const layout = section.layout || "top";
            const isCrop = section.imageStyle?.crop !== false;
            const size = section.imageStyle?.size || "large";
            const widthMap: Record<string, string> = {
              small: "260px",
              medium: "400px",
              large: "580px",
              full: "100%",
            };

            return (
              <div key={index}>
                <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                  // {section.title || "Information"}
                </p>
                <div
                  className="glass-card"
                  style={{
                    padding: "clamp(24px, 4vw, 36px)",
                    display: "flex",
                    flexDirection:
                      layout === "top"
                        ? "column"
                        : layout === "left"
                          ? "row"
                          : "row-reverse",
                    gap: "32px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {section.image && (
                    <div
                      style={{
                        flex: layout === "top" ? "1 1 100%" : `0 0 ${widthMap[size]}`,
                        width: "100%",
                        maxWidth: "100%",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid var(--glass-border)",
                        background: "rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={section.image}
                        alt={section.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: layout === "top" ? "500px" : "600px",
                          objectFit: isCrop ? "cover" : "contain",
                          display: "block",
                        }}
                      />
                    </div>
                  )}
                  <div style={{ flex: "1 1 300px", width: "100%", maxWidth: "100%" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "15.5px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.85,
                      }}
                    >
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
                <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                  // {section.title || "Frequently Asked Questions"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {section.items?.map((faq, i) => (
                    <div
                      key={i}
                      className="glass-card"
                      style={{
                        padding: "24px 32px",
                        background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          marginBottom: "10px",
                        }}
                      >
                        <MessageCircle
                          size={16}
                          style={{
                            color: "var(--electric-blue)",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <h4
                          style={{
                            fontFamily: "var(--font-headline)",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            lineHeight: 1.45,
                            margin: 0,
                          }}
                        >
                          {faq.question}
                        </h4>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          paddingLeft: "28px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
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
                <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                  // {section.title || "History & Milestones"}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    position: "relative",
                  }}
                >
                  {section.items?.map((item, i) => (
                    <div
                      key={i}
                      className="glass-card"
                      style={{
                        padding: "clamp(20px, 3vw, 28px)",
                        background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
                        {item.year && (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "var(--cyber-gold)",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {item.year}
                          </span>
                        )}
                        {item.title && (
                          <h4
                            style={{
                              fontFamily: "var(--font-headline)",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              margin: 0,
                            }}
                          >
                            {item.title}
                          </h4>
                        )}
                      </div>
                      {item.description && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.65,
                            margin: 0,
                          }}
                        >
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
                <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                  // {section.title || "Get In Touch"}
                </p>
                <div
                  className="glass-card"
                  style={{
                    padding: "28px 32px",
                    background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {section.name && (
                    <h4
                      style={{
                        fontFamily: "var(--font-headline)",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "4px",
                      }}
                    >
                      {section.name}
                    </h4>
                  )}
                  {section.role && (
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--cyber-gold)",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      {section.role}
                    </p>
                  )}
                  {section.email && (
                    <a
                      href={`mailto:${section.email}`}
                      style={{
                        color: "var(--electric-blue)",
                        textDecoration: "none",
                        fontSize: "14px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "var(--font-mono)",
                      }}
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
