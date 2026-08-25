import { Link } from "react-router";
import { useTheme } from "next-themes";
import { ChevronRight } from "lucide-react";
import { useCommittees } from "../../../hooks/useSanityData";
import { useHomePageData } from "../../../context/HomePageContext";
import { MagneticButton } from "../shared/MagneticButton";
import { Skeleton } from "boneyard-js/react";
import { CyclingStat, type StatItem } from "./hero/CyclingStat";
import { LabStatusRack } from "./hero/LabStatusRack";
import { BranchTelemetryCard, HeroAboutCard } from "./hero/HeroStats";

export function BentoHero() {
  let theme: string | undefined = "dark";
  try {
    const themeCtx = useTheme();
    theme = themeCtx?.theme;
  } catch {
    theme = "dark";
  }
  const { data: homeData, loading: homeLoading } = useHomePageData();
  const { committees, loading: committeesLoading } = useCommittees();

  const isLight = theme === "light";
  const loading = homeLoading || committeesLoading;

  // Hero copy with standard fallbacks
  const heroTitle = homeData?.heroTitle || "Fostering technological innovation and excellence for the benefit of humanity.";
  const heroSubtitle = homeData?.heroSubtitle || "The student branch of IEEE at Purdue University — West Lafayette";
  const rawHeroImage = homeData?.heroImage || "/images/general%20IEEE%20pictures/ieee%20whole%20team%20photo.webp";
  const aboutTitle   = homeData?.aboutTitle   ?? null;
  const aboutContent = homeData?.aboutContent ?? null;
  const stats: StatItem[] = (homeData?.stats && homeData.stats.length > 0) ? homeData.stats : [];
  const hqLocation        = homeData?.hqLocation     ?? null;
  const discordMembers    = homeData?.discordMembers ?? null;
  const campusLocation    = homeData?.campusLocation ?? null;

  // Optimize image URL for responsive format & compression safely without duplicate query strings
  const heroImage = rawHeroImage
    ? (rawHeroImage.includes("?") ? rawHeroImage : `${rawHeroImage}?w=1400&auto=format&q=80`)
    : null;

  return (
    <section
      id="hero-bento"
      style={{
        position: "relative",
        background: "var(--boiler-black)",
        minHeight: "100vh",
        padding: "100px 0 64px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Graphic Grid */}
      <div
        className="ieee-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: isLight ? 0.3 : 0.25,
          zIndex: 1,
        }}
      />
      
      {/* Visual Ambient Glow Orbs */}
      <div
        className="electric-glow-orb animate-glow-pulse-no-x"
        style={{
          width: "600px",
          height: "600px",
          top: "10%",
          left: "-10%",
          background: isLight 
            ? "radial-gradient(circle, rgba(0, 98, 155, 0.05) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0, 98, 155, 0.15) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        className="electric-glow-orb animate-glow-pulse-no-x"
        style={{
          width: "500px",
          height: "500px",
          bottom: "10%",
          right: "-10%",
          background: isLight 
            ? "radial-gradient(circle, rgba(235, 211, 169, 0.03) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(235, 211, 169, 0.1) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
        }}
      >
        <Skeleton name="bento-hero" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
          <div className="bento-grid">
            
            {/* 1. Hero Block (3x2 span) */}
            <div
              className="glass-card hero-bento-tile"
              style={{
                padding: "clamp(24px, 5vw, 40px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                backgroundImage: heroImage
                  ? isLight
                    ? `linear-gradient(to right, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.45) 40%, rgba(255, 255, 255, 0.18) 70%, rgba(255, 255, 255, 0.5) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, transparent 40%, transparent 60%, rgba(255, 255, 255, 0.5) 100%), url('${heroImage}')`
                    : `linear-gradient(to right, rgba(10, 10, 12, 0.92) 0%, rgba(10, 10, 12, 0.55) 38%, rgba(10, 10, 12, 0.35) 58%, rgba(10, 10, 12, 0.88) 100%), linear-gradient(to bottom, rgba(10, 10, 12, 0.15) 0%, transparent 30%, transparent 65%, rgba(10, 10, 12, 0.75) 100%), url('${heroImage}')`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {heroTitle && (
                <h1
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "clamp(28px, 4.5vw, 46px)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: isLight ? "var(--text-primary)" : "#ffffff",
                    letterSpacing: "-0.02em",
                    marginBottom: "16px",
                    textShadow: isLight ? "none" : "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {heroTitle.includes("innovation") ? (
                    <>
                      {heroTitle.split("innovation")[0]}
                      <span style={{ color: isLight ? "var(--electric-blue)" : "#38BDF8" }}>innovation</span>
                      {heroTitle.split("innovation")[1]}
                    </>
                  ) : heroTitle}
                </h1>
              )}
              
              {heroSubtitle && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: isLight ? "var(--text-muted)" : "rgba(255, 255, 255, 0.85)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "32px",
                    textShadow: isLight ? "none" : "0 1px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {heroSubtitle}
                </p>
              )}

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <MagneticButton
                  variant="primary"
                  to="/committees"
                  style={{ width: "auto" }}
                >
                  Explore Committees
                </MagneticButton>
                <Link
                  to="/join"
                  className="btn-ghost"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                  }}
                >
                  Join Purdue IEEE
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* 2. Where Our Engineers Go (1x1 span) */}
            <BranchTelemetryCard
              companies={homeData?.alumniCompanies}
              highlightText={homeData?.alumniHighlightText}
              hqLocation={hqLocation}
              committeesCount={committees?.length}
              discordMembers={discordMembers}
              campusLocation={campusLocation}
            />

            {/* 3. Core Stats (1x1 span) */}
            {stats.length > 0 ? (
              <CyclingStat stats={stats} isLight={isLight} />
            ) : null}

            {/* 4. Lab Status Rack (2x2 span) */}
            <LabStatusRack committees={committees} isLight={isLight} />

            {/* 5. About Us (2x2 span) */}
            <HeroAboutCard aboutTitle={aboutTitle} aboutContent={aboutContent} />

          </div>
        </Skeleton>
      </div>
    </section>
  );
}
