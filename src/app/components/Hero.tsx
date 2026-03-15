import { ChevronDown, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { committees as committeeData } from "../../data/committees";
import { MagneticButton } from "./MagneticButton";

const LAB_IMAGE =
  "https://images.unsplash.com/photo-1619834043185-acbe47811e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHJlc2VhcmNoJTIwbGFiJTIwZGFyayUyMGhpZ2glMjB0ZWNofGVufDF8fHx8MTc3MzE4NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080";

const MotionLink = motion(Link);

export function Hero() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleScroll = () => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isLight = theme === "light";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.6
      }
    }
  };

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
        overflow: "hidden",
      }}
    >
      {/* Background Lab Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${LAB_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: isLight ? 0.3 : 0.25,
        }}
      />

      {/* Bottom Gradient Fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight 
            ? "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(248,250,252,0.8) 85%, var(--boiler-black) 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 85%, var(--boiler-black) 100%)",
        }}
      />

      {/* 32px Grid Overlay */}
      <div
        className="ieee-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1,
        }}
      />

      {/* Electric Glow Orbs */}
      <div
        className="electric-glow-orb animate-glow-pulse"
        style={{
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          background: isLight
            ? "radial-gradient(circle, rgba(0,98,155,0.08) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(0,98,155,0.22) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "max(120px, 15vh)",
          paddingBottom: "80px",
          width: "100%",
        }}
      >
        {/* Eyebrow Tag */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: isLight ? "rgba(0,90,135,0.08)" : "rgba(0,98,155,0.15)",
              border: isLight ? "1px solid rgba(0,90,135,0.2)" : "1px solid rgba(0,98,155,0.4)",
              borderRadius: "2px",
              padding: "6px 14px 6px 10px",
            }}
          >
            <Zap size={12} style={{ color: "var(--electric-blue)", fill: "var(--electric-blue)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.55rem, 1.5vw, 0.65rem)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--electric-blue)",
              }}
            >
              Purdue University · West Lafayette, IN
            </span>
          </div>

          {/* Status indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C853", animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.55rem, 1.5vw, 0.62rem)",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Spring 2026 Active
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(34px, 5.5vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--text-primary)",
            maxWidth: "1000px",
            marginBottom: "32px",
            letterSpacing: "-0.02em",
          }}
        >
          “Fostering technological{" "}
          <span style={{ color: "var(--electric-blue)", textShadow: isLight ? "none" : "0 0 40px rgba(0,98,155,0.3)" }}>
            innovation
          </span>{" "}
          and excellence for the benefit of{" "}
          <span style={{ color: "var(--cyber-gold)" }}>humanity.</span>”
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
            color: "var(--text-muted)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "48px"
          }}
        >
          — IEEE Mission Statement
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            marginBottom: "72px",
          }}
        >
          <MagneticButton className="btn-primary" onClick={() => navigate("/committees")} style={{ width: "auto", minWidth: "180px", padding: "16px 32px" }}>
            Explore Committees
          </MagneticButton>
          <MagneticButton className="btn-ghost" onClick={() => navigate("/about")} style={{ width: "auto", minWidth: "180px", padding: "16px 32px" }}>
            Learn More
          </MagneticButton>
        </motion.div>

        {/* Bottom Meta Bar (Technical Committee Tags) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px 16px",
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
                padding: "6px 14px",
                fontSize: "0.68rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              whileHover={{ y: -2, backgroundColor: "rgba(0, 98, 155, 0.05)", borderColor: "var(--electric-blue)", color: "var(--electric-blue)" }}
            >
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "currentColor", opacity: 0.5 }} />
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
