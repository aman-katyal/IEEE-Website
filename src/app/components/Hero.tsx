import { ChevronDown, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { committees as committeeData } from "../../data/committees";
import { MagneticButton } from "./MagneticButton";
import { useHomePage } from "../../hooks/useSanityData";

const FALLBACK_LAB_IMAGE =
  "https://images.unsplash.com/photo-1619834043185-acbe47811e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHJlc2VhcmNoJTIwbGFiJTIwZGFyayUyMGhpZ2glMjB0ZWNofGVufDF8fHx8MTc3MzE4NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080";

const MotionLink = motion.create(Link);

export function Hero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data } = useHomePage();

  const handleScroll = () => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isLight = theme === "light";

  const heroImage = data?.heroImage || FALLBACK_LAB_IMAGE;
  const heroTitle = data?.heroTitle || "“Fostering technological innovation and excellence for the benefit of humanity.”";
  const heroSubtitle = data?.heroSubtitle || "— IEEE Mission Statement";
  const sysUptime = data?.sysUptime || "ACTIVE";
  const semester = data?.semester || "SP_2026";

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--boiler-black)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Photo - High Visibility for group photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%", // Adjusted to keep faces in view
          opacity: isLight ? 0.85 : 0.7, // High opacity to see everyone clearly
          transition: "background-image 0.8s ease-in-out",
        }}
      />

      {/* Subtle Gradient - Only at the very bottom to transition to content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight 
            ? "linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(248,250,252,0.95) 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Grid Overlay - Very faint to avoid obscuring faces */}
      <div
        className="ieee-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
        }}
      />

      {/* Content Container */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3
            }
          }
        }}
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "25vh", // Pushed down further so group photo is clear
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Eyebrow Tags */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: isLight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "4px",
              padding: "6px 12px",
            }}
          >
            <Zap size={12} style={{ color: "var(--electric-blue)", fill: "var(--electric-blue)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--electric-blue)",
                fontWeight: 600
              }}
            >
              Purdue University
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: isLight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid var(--glass-border)", borderRadius: "4px", padding: "6px 12px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: sysUptime === "ACTIVE" ? "#00C853" : "#FF5252", animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              {semester.replace('_', ' ')} {sysUptime}
            </span>
          </div>
        </motion.div>

        {/* Headline / Quote - High Contrast Shadow for Readability */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(22px, 3vw, 38px)",
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#FFFFFF", // Force white for contrast on photo
            textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.4)",
            maxWidth: "750px",
            marginBottom: "20px",
            letterSpacing: "0.01em",
            fontStyle: "italic",
          }}
        >
          {heroTitle.includes("innovation") ? (
            <>
              {heroTitle.split("innovation")[0]}
              <span style={{ color: "var(--cyber-gold)" }}>
                innovation
              </span>
              {heroTitle.split("innovation")[1]}
            </>
          ) : heroTitle}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.8)",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "48px"
          }}
        >
          {heroSubtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            alignItems: "center",
            marginBottom: "80px",
          }}
        >
          <MagneticButton 
            variant="primary" 
            onClick={() => navigate("/committees")} 
            style={{ 
              width: "auto", 
              minWidth: "200px", 
              padding: "16px 32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
          >
            Explore Committees
          </MagneticButton>
        </motion.div>

        {/* Committee Tags - Highly legible background */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px 10px",
            flexWrap: "wrap",
            maxWidth: "900px",
            margin: "0 auto"
          }}
        >
          {committeeData.map((c) => (
            <MotionLink
              key={c.id}
              to={`/committee/${c.id}`}
              variants={itemVariants}
              className="tech-tag"
              style={{ 
                textDecoration: "none", 
                cursor: "pointer", 
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                padding: "5px 12px",
                fontSize: "0.6rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.15)"
              }}
              whileHover={{ y: -2, backgroundColor: "var(--electric-blue)", borderColor: "var(--electric-blue)" }}
            >
              <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--cyber-gold)", opacity: 0.8 }} />
              {c.shortName}
            </MotionLink>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={handleScroll}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          zIndex: 10,
        }}
        className="hidden md:flex"
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          Scroll
        </span>
        <div className="scroll-indicator">
          <ChevronDown size={18} style={{ color: "var(--text-muted)" }} />
        </div>
      </motion.button>
    </section>
  );
}
