import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useHomePage } from "../../hooks/useSanityData";

export function About() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data } = useHomePage();
  const isLight = theme === "light";

  const aboutEyebrow = data?.aboutEyebrow || "// Overview";
  const aboutTitle = data?.aboutTitle || "At Purdue, we strive to be the best";
  const aboutContent = data?.aboutContent || "Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. Purdue IEEE is the university's largest technical organization, where students from all backgrounds work on real-world problems and advance their engineering skills.";
  const aboutStatsValue = data?.aboutStatsValue || "1903";
  const aboutStatsLabel = data?.aboutStatsLabel || "Established & Innovating";

  return (
    <section
      id="about"
      style={{
        background: "var(--boiler-black)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: isLight ? 0.4 : 0.25 }}
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
        <motion.div 
          className="ieee-grid-2" 
          style={{ alignItems: "center" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
              {aboutEyebrow}
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
              {aboutTitle.includes("best") ? (
                <>
                  {aboutTitle.split("best")[0]}
                  <span style={{ color: "var(--electric-blue)" }}>best</span>
                  {aboutTitle.split("best")[1]}
                </>
              ) : aboutTitle}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                marginBottom: "32px",
              return (
                <section
                  id="about"
              ...
                        <button
                          className="btn-primary"
                          onClick={() => navigate("/about")}
                          style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          Learn More About Us
                          <ChevronRight size={18} />
                        </button>
                      </div>
                      <div className="glass-card" style={{ padding: "48px", background: "rgba(0, 98, 155, 0.05)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                         {data?.aboutImage ? (
                           <img 
                             src={data.aboutImage} 
                             alt="IEEE Heritage" 
                             style={{ width: "100%", height: "auto", borderRadius: "4px", filter: isLight ? "none" : "brightness(0.8) contrast(1.1)" }} 
                           />
                         ) : (
                           <div>
                             <div style={{ fontSize: "64px", fontWeight: 700, color: "var(--electric-blue)", fontFamily: "var(--font-headline)", marginBottom: "8px" }}>{aboutStatsValue}</div>
                             <p style={{ color: "var(--cyber-gold)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "12px", fontFamily: "var(--font-mono)" }}>{aboutStatsLabel}</p>
                           </div>
                         )}
                      </div>
                    </motion.div>
                  </div>
                </section>
              );
              }
