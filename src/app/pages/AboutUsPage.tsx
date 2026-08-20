import { useEffect } from "react";
import { motion } from "motion/react";
import { useAboutPage } from "../../hooks/useSanityData";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import React from "react";

const SectionTitle = React.memo(
  ({ title, colorTheme }: { title: string; colorTheme: string }) => {
    const words = (title || "").split(" ");
    const lastIndex = words.length - 1;
    const highlightColor =
      colorTheme === "gold" ? "var(--cyber-gold)" : "var(--electric-blue)";

    return (
      <h2
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: "24px",
        }}
      >
        {words.map((word, i) => (
          <span key={i}>
            {i === lastIndex ? (
              <span style={{ color: highlightColor }}>{word}</span>
            ) : (
              word
            )}{" "}
          </span>
        ))}
      </h2>
    );
  },
);

export interface AboutSectionData {
  _key?: string;
  eyebrow?: string;
  title?: string;
  content?: string;
  image?: string;
  layout?: "normal" | "reversed" | string;
  colorTheme?: "gold" | string;
}

export function AboutUsPage() {
  const { data, loading } = useAboutPage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const revealProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  };

  const sections = data?.sections || [];

  return (
    <div style={{ paddingTop: "80px", background: "var(--boiler-black)" }}>
      {/* Heritage & Impact - The moved content */}
      <section style={{ padding: "80px 0 40px", position: "relative" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="glass-card"
              style={{
                padding: "32px",
                borderLeft: "4px solid var(--cyber-gold)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--cyber-gold)",
                  marginBottom: "12px",
                }}
              >
                Established 1903
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Over a century of fostering innovation and engineering
                excellence at Purdue University.
              </p>
            </div>
            <div
              className="glass-card"
              style={{
                padding: "32px",
                borderLeft: "4px solid var(--electric-blue)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--electric-blue)",
                  marginBottom: "12px",
                }}
              >
                Professional Growth
              </h3>
              <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Professional Careers",
                  "Engineering Software",
                  "Practical Solutions",
                  "Lasting Connections",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--electric-blue)",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="glass-card"
              style={{
                padding: "32px",
                borderLeft: "4px solid var(--cyber-gold)",
              }}
            >
              <figure style={{ margin: 0 }}>
                <blockquote
                  style={{
                    fontStyle: "italic",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: "0 0 16px",
                  }}
                >
                  "Our alumni go on to work at some of the world's largest
                  companies... helping shape the future of technology."
                </blockquote>
                <figcaption
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--cyber-gold), var(--electric-blue))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#000",
                      flexShrink: 0,
                    }}
                  >
                    PI
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-headline)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {data?.quoteAuthor || "Purdue IEEE Leadership"}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {data?.quoteAuthorTitle ||
                        "Executive Officer, Purdue IEEE"}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        style={{
          background: "var(--boiler-black)",
          padding: "40px 0 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="ieee-grid-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.25 }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
          }}
        >
          {sections.map((section: AboutSectionData, idx: number) => (
            <motion.div
              key={idx}
              className={section.image ? "ieee-grid-2" : ""}
              style={{
                marginBottom: idx === sections.length - 1 ? "0" : "120px",
                alignItems: "center",
                maxWidth: section.image ? "none" : "800px",
                margin: section.image ? "0 auto 120px" : "0 auto 120px",
              }}
              {...revealProps}
            >
              <div style={{ order: section.layout === "reversed" ? 2 : 1 }}>
                <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                  {section.eyebrow?.startsWith("//")
                    ? section.eyebrow
                    : `// ${section.eyebrow}`}
                </p>
                <SectionTitle
                  title={section.title || ""}
                  colorTheme={section.colorTheme || ""}
                />
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </div>
              {section.image && (
                <div style={{ order: section.layout === "reversed" ? 1 : 2 }}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    }}
                  >
                    <img
                      src={section.image}
                      alt={section.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        filter: isLight
                          ? "none"
                          : "brightness(0.8) contrast(1.1)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        border: "1px solid var(--glass-border)",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
