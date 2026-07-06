import { ChevronDown, Zap } from "lucide-react";
import { Link, LinkProps, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { MagneticButton } from "./MagneticButton";
import { useHomePage, useCommittees } from "../../hooks/useSanityData";
import { client } from "../../lib/sanity";
import { Skeleton } from "boneyard-js/react";

import { forwardRef } from "react";

const FALLBACK_LAB_IMAGE =
  "https://images.unsplash.com/photo-1619834043185-acbe47811e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHJlc2VhcmNoJTIwbGFiJTIwZGFyayUyMGhpZ2glMjB0ZWNofGVufDF8fHx8MTc3MzE4NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080";

const MotionLink = motion.create(
  forwardRef<HTMLAnchorElement, LinkProps & { whileHover?: any; whileTap?: any; transition?: any; variants?: any }>(
    ({ whileHover, whileTap, transition, variants, ...props }, ref) => (
      <Link ref={ref} {...props} />
    )
  )
);

export function Hero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data, loading: homeLoading } = useHomePage();
  const { committees: committeeData, loading: committeesLoading } = useCommittees();

  const loading = homeLoading || committeesLoading;

  const handleScroll = () => {
    const el = document.querySelector("#about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isLight = theme === "light";

  const heroImage = data?.heroImage;
  const heroTitle = data?.heroTitle || "Fostering technological innovation and excellence for the benefit of humanity.";
  const heroSubtitle = data?.heroSubtitle || "— IEEE Mission Statement";
  const sysUptime = data?.sysUptime || (client ? "OFFLINE" : "LOCAL");
  const semester = data?.semester || "SP_2026";

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
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
      {/* Background Photo */}
      {heroImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${heroImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
            opacity: isLight ? 0.5 : 0.35, // Balanced opacity
            transition: "background-image 0.8s ease-in-out",
          }}
        />
      )}

      {/* Standardized Gradients for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight 
            ? "linear-gradient(to bottom, rgba(248,250,252,0.9) 0%, rgba(248,250,252,0.2) 30%, rgba(248,250,252,0.2) 70%, rgba(248,250,252,1) 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, var(--boiler-black) 100%)",
        }}
      />

      {/* Grid Overlay */}
      <div
        className="ieee-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
        }}
      />

      {/* Content Container */}
      <Skeleton name="committee-banner" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
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
            paddingTop: "80px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >


          {/* Headline / Quote - Standardized Design System Shadows */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(24px, 4.5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "var(--text-primary)",
              maxWidth: "900px",
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            {heroTitle.includes("innovation") ? (
              <>
                {heroTitle.split("innovation")[0]}
                <span style={{ color: "var(--electric-blue)" }}>
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
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "120px"
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
              }}
            >
              Explore Committees
            </MagneticButton>
          </motion.div>

          {/* Committee Tags - Inherits stagger from parent */}
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px 12px",
              flexWrap: "wrap",
              maxWidth: "1000px",
              margin: "0 auto",
              marginTop: "20px",
              paddingBottom: "120px" // Increased space for scroll button
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
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-secondary)",
                  padding: "6px 14px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  display: "inline-flex",
                  alignItems: "center"
                }}
                whileHover={{ 
                  backgroundColor: "rgba(0, 98, 155, 0.1)", 
                  borderColor: "var(--electric-blue)",
                  color: "var(--text-primary)",
                  y: -3
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {c.shortName}
              </MotionLink>
            ))}
          </motion.div>
        </motion.div>
      </Skeleton>

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
