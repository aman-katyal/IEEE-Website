import { useEffect } from "react";
import { motion } from "motion/react";
import { useAboutPage } from "../../hooks/useSanityData";
import { useTheme } from "next-themes";

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
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const fallbackSections = [
    {
      eyebrow: "// Excellence",
      title: "At Purdue, we strive to be the best",
      content: "Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. Purdue IEEE (Eye-Triple-E) is no different. Founded in 1903, we are the largest technical organization with students of every academic background. Our members work on real-world problems and advance their engineering skills.",
      image: "",
      layout: "normal"
    },
    {
      eyebrow: "// Technical Growth",
      title: "Applying academics to extracurriculars",
      content: "Purdue IEEE continually strives to further our goals of technical and professional growth. We help our members enter their professional careers, learn engineering software and skills, and socialize with others to form lasting connections inside and outside of this organization.\\n\\nOur teams apply the knowledge and create real-world, practical solutions to complex engineering projects.",
      image: "",
      colorTheme: "gold",
      layout: "reversed"
    },
    {
      eyebrow: "// Professional Success",
      title: "Connecting industry partners to talented engineers",
      content: "Our alumni go on to utilize the skills they learn at some of the world's largest companies. We have alumni working in every sector of every industry, helping shape the future of technology.\\n\\nWe host regular professional networking events and company recruiting sessions - just for our members. We also host resume reviews, alumni panels, and professor talks.",
      image: "",
      layout: "normal"
    }
  ];

  const sections = data?.sections || fallbackSections;

  return (
    <div style={{ paddingTop: "80px", background: "var(--boiler-black)" }}>
      {/* Heritage & Impact - The moved content */}
      <section style={{ padding: "80px 0 40px", position: "relative" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            <div className="glass-card" style={{ padding: "32px", borderLeft: "4px solid var(--cyber-gold)" }}>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "20px", fontWeight: 700, color: "var(--cyber-gold)", marginBottom: "12px" }}>Established 1903</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>Over a century of fostering innovation and engineering excellence at Purdue University.</p>
            </div>
            <div className="glass-card" style={{ padding: "32px", borderLeft: "4px solid var(--electric-blue)" }}>
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "20px", fontWeight: 700, color: "var(--electric-blue)", marginBottom: "12px" }}>Professional Growth</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {["Professional Careers", "Engineering Software", "Practical Solutions", "Lasting Connections"].map(item => (
                  <li key={item} style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--electric-blue)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card" style={{ padding: "32px", borderLeft: "4px solid var(--cyber-gold)" }}>
              <p style={{ fontStyle: "italic", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                "Our alumni go on to work at some of the world's largest companies... helping shape the future of technology."
              </p>
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
        <div className="ieee-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />

        <div style={{ position: "relative", zIndex: 5, maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
          {sections.map((section: any, idx: number) => (
            <motion.div
              key={idx}
              className={section.image ? "ieee-grid-2" : ""}
              style={{
                marginBottom: idx === sections.length - 1 ? "0" : "120px",
                alignItems: "center",
                maxWidth: section.image ? "none" : "800px",
                margin: section.image ? "0 auto 120px" : "0 auto 120px"
              }}
              {...revealProps}
            >
              <div style={{ order: section.layout === "reversed" ? 2 : 1 }}>
                <p className="section-eyebrow" style={{ marginBottom: "16px" }}>{section.eyebrow}</p>
                <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "24px" }}>
                  {(section.title || "").split(' ').map((word: string, i: number, arr: string[]) => {
                    const isLast = i === arr.length - 1;
                    const highlightColor = section.colorTheme === "gold" ? "var(--cyber-gold)" : "var(--electric-blue)";
                    return <span key={i}>{isLast ? <span style={{ color: highlightColor }}>{word}</span> : word}{' '}</span>
                  })}
                </h2>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {section.content}
                </div>
              </div>
              {section.image && (
                <div style={{ order: section.layout === "reversed" ? 1 : 2 }}>
                  <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      style={{ width: "100%", height: "auto", display: "block", filter: isLight ? "none" : "brightness(0.8) contrast(1.1)" }} 
                    />
                    <div style={{ position: "absolute", inset: 0, border: "1px solid var(--glass-border)", borderRadius: "8px" }} />
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
