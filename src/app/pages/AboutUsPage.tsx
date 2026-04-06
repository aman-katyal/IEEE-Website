import { useEffect } from "react";
import { motion } from "motion/react";
import { useAboutPage } from "../../hooks/useSanityData";

export function AboutUsPage() {
  const { data, loading } = useAboutPage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const revealProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const fallbackSections = [
    {
      eyebrow: "// Excellence",
      title: "At Purdue, we strive to be the best",
      content: "Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. Purdue IEEE (Eye-Triple-E) is no different. Founded in 1903, we are the largest technical organization with students of every academic background. Our members work on real-world problems and advance their engineering skills.",
      cardTitle: "Established 1903",
      cardContent: "Over a century of fostering innovation and engineering excellence at Purdue University.",
      colorTheme: "blue",
      layout: "normal"
    },
    {
      eyebrow: "// Technical Growth",
      title: "Applying academics to extracurriculars",
      content: "Purdue IEEE continually strives to further our goals of technical and professional growth. We help our members enter their professional careers, learn engineering software and skills, and socialize with others to form lasting connections inside and outside of this organization.\n\nOur teams apply the knowledge and create real-world, practical solutions to complex engineering projects.",
      cardTitle: "",
      cardContent: "Professional Careers\nEngineering Software\nPractical Solutions\nLasting Connections",
      colorTheme: "gold",
      layout: "reversed"
    },
    {
      eyebrow: "// Professional Success",
      title: "Connecting industry partners to talented engineers",
      content: "Our alumni go on to utilize the skills they learn at some of the world's largest companies. We have alumni working in every sector of every industry, helping shape the future of technology.\n\nWe host regular professional networking events and company recruiting sessions - just for our members. We also host resume reviews, alumni panels, and professor talks.\n\nWith Purdue IEEE, you can learn what it takes to be successful after college, whether it be in industry or academia.",
      cardTitle: "",
      cardContent: "\"Our alumni go on to work at some of the world's largest companies... helping shape the future of technology.\"",
      colorTheme: "blue",
      layout: "normal"
    }
  ];

  const sections = data?.sections || fallbackSections;

  return (
    <div style={{ paddingTop: "80px", background: "var(--boiler-black)" }}>
      <section
        id="about"
        style={{
          background: "var(--boiler-black)",
          padding: "96px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid */}
        <div
          className="ieee-grid-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.25 }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, var(--electric-blue) 30%, var(--cyber-gold) 50%, var(--electric-blue) 70%, transparent 100%)",
            opacity: 0.4
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, var(--electric-blue) 50%, transparent 100%)",
            opacity: 0.2
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          {sections.map((section: any, idx: number) => (
            <motion.div
              key={idx}
              className="ieee-grid-2"
              style={{
                marginBottom: idx === sections.length - 1 ? "0" : "96px",
                alignItems: "center"
              }}
              {...revealProps}
            >
              <div style={{ order: section.layout === "reversed" ? 2 : 1 }}>
                <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
                  {section.eyebrow}
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "clamp(32px, 4vw, 48px)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    marginBottom: "24px",
                  }}
                >
                  {section.title.split(' ').map((word: string, i: number, arr: string[]) => {
                    const isLast = i === arr.length - 1;
                    const highlightColor = section.colorTheme === "gold" ? "var(--cyber-gold)" : "var(--electric-blue)";
                    return (
                      <span key={i}>
                        {isLast ? <span style={{ color: highlightColor }}>{word}</span> : word}{' '}
                      </span>
                    )
                  })}
                </h2>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    whiteSpace: "pre-line"
                  }}
                >
                  {section.content}
                </div>
              </div>
              <div style={{ order: section.layout === "reversed" ? 1 : 2 }}>
                <div 
                  className="glass-card" 
                  style={{ 
                    padding: "40px", 
                    textAlign: section.cardTitle ? "center" : "left", 
                    background: section.colorTheme === "gold" ? "rgba(235, 211, 169, 0.05)" : "rgba(0, 98, 155, 0.05)",
                    borderLeft: !section.cardTitle && section.cardContent.startsWith('"') ? `4px solid var(--cyber-gold)` : "none"
                  }}
                >
                  {section.cardTitle && (
                    <h3 style={{ color: "var(--cyber-gold)", fontSize: "24px", marginBottom: "16px", fontFamily: "var(--font-headline)" }}>
                      {section.cardTitle}
                    </h3>
                  )}
                  {section.cardContent.includes('\n') ? (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                      {section.cardContent.split('\n').map((item: string) => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-primary)", fontSize: "15px", fontFamily: "var(--font-body)" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--electric-blue)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ 
                      fontStyle: section.cardContent.startsWith('"') ? "italic" : "normal", 
                      color: "var(--text-secondary)", 
                      lineHeight: 1.6, 
                      fontSize: "15px", 
                      fontFamily: "var(--font-body)" 
                    }}>
                      {section.cardContent}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
