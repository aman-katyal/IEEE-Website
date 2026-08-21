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
  const { data } = useAboutPage();
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

      {/* Historical Lineage & Committee Origins Timeline */}
      <section
        id="history"
        style={{
          padding: "60px 0 80px",
          position: "relative",
          background: isLight ? "#f8fafc" : "rgba(10, 10, 12, 0.6)",
          borderTop: "1px solid var(--glass-border)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px" }}>
            <p className="section-eyebrow" style={{ marginBottom: "12px" }}>
              // HISTORICAL LINEAGE & ROOTS
            </p>
            <h2
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              Over 120 Years of <span style={{ color: "var(--cyber-gold)" }}>Boilermaker Innovation</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              From our founding under the American Institute of Electrical Engineers (AIEE) in 1903 through historic committee launches and society mergers, Purdue IEEE has stood at the vanguard of hands-on student engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                year: "1903",
                title: "AIEE Purdue Branch Founded",
                category: "Branch Origin",
                description: "The American Institute of Electrical Engineers charters the Purdue Student Branch, inaugurating over a century of Boilermaker technical leadership.",
                gold: true,
              },
              {
                year: "1950s",
                title: "Grand Prix & Racing Heritage",
                category: "Motorsports",
                description: "Purdue IEEE members engineer early electric and combustion vehicles for the Purdue Grand Prix, creating the foundation for IEEE Racing.",
                gold: false,
              },
              {
                year: "1963",
                title: "Historic IEEE Merger",
                category: "Global Unity",
                description: "AIEE merges with the Institute of Radio Engineers (IRE) to create IEEE, uniting power, radio, electronics, and computing under one banner.",
                gold: true,
              },
              {
                year: "1990s",
                title: "Computer Society (CS)",
                category: "Computing",
                description: "Chartered to pioneer student software systems, servers, microcontrollers, and modern computing workshops across campus.",
                gold: false,
              },
              {
                year: "1996",
                title: "Aerial Robotics (AESS)",
                category: "Aviation & UAVs",
                description: "Launched to design, manufacture, and fly autonomous drones and unmanned aerial systems for national payload competitions.",
                gold: false,
              },
              {
                year: "2008",
                title: "ROV Underwater Robotics",
                category: "Marine Robotics",
                description: "Founded to engineer custom submersibles with advanced buoyancy control and machine vision for the international MATE ROV competition.",
                gold: false,
              },
              {
                year: "2016",
                title: "EMBS & MTT-S Expansions",
                category: "Biotech & RF",
                description: "Dual expansion into biomedical instrumentation (EMBS) and high-frequency microwave, antenna, and radar engineering (MTT-S).",
                gold: true,
              },
              {
                year: "2020s+",
                title: "Cornerstones & Modern Era",
                category: "Modern Expansion",
                description: "Democratizing foundational engineering skills with Hardware, Software, Learning, Social, and IR Cornerstones across 14 committees.",
                gold: true,
              },
            ].map((milestone, idx) => (
              <motion.div
                key={idx}
                className="glass-card hover-glow-blue"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "10px",
                  borderLeft: milestone.gold ? "3px solid var(--cyber-gold)" : "3px solid var(--electric-blue)",
                  background: isLight ? "#ffffff" : "rgba(18, 18, 20, 0.75)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                {...revealProps}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: milestone.gold ? "var(--cyber-gold)" : "var(--electric-blue)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {milestone.year}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        background: milestone.gold ? "rgba(235, 211, 169, 0.12)" : "rgba(0, 98, 155, 0.12)",
                        color: milestone.gold ? "var(--cyber-gold)" : "var(--electric-blue)",
                        border: milestone.gold ? "1px solid rgba(235, 211, 169, 0.25)" : "1px solid rgba(0, 98, 155, 0.25)",
                      }}
                    >
                      {milestone.category}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-headline)",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "10px",
                      lineHeight: 1.3,
                    }}
                  >
                    {milestone.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
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
