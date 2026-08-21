import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { Mail, Award, Rocket, Shield, Cpu, Download } from "lucide-react";
import {
  usePartners,
  useSiteSettings,
  Partner,
} from "../../hooks/useSanityData";

export function PartnersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { partners, loading: partnersLoading } = usePartners();

  const loading = settingsLoading || partnersLoading;

  const showCorporateTiers = settings?.showCorporateTiers === true;

  const goldPartners = useMemo(
    () => partners.filter((p) => p.tier === "Gold"),
    [partners],
  );
  const silverPartners = useMemo(
    () => partners.filter((p) => p.tier === "Silver"),
    [partners],
  );
  const bronzePartners = useMemo(
    () => partners.filter((p) => p.tier === "Bronze"),
    [partners],
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "var(--boiler-black)",
          color: "var(--text-primary)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            className="animate-spin"
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--electric-blue)",
              borderTopColor: "transparent",
              borderRadius: "50%",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            Loading Partners...
          </p>
        </div>
      </div>
    );
  }

  // Use dynamic content from settings or fall back to default values
  const heroTitle =
    settings?.partnersHeroTitle ||
    "Empowering the next generation of innovators";
  const heroSubtitle =
    settings?.partnersHeroSubtitle ||
    "Our partners provide the resources, mentorship, and opportunities that allow our members to push the boundaries of what's possible in engineering.";

  const revealProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div
      style={{
        paddingTop: "80px",
        minHeight: "100vh",
        background: "var(--boiler-black)",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: "80px 0 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="ieee-grid-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.2 }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <motion.div {...revealProps}>
            <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
              // Corporate Relations
            </p>
            <h1
              className="text-heading-1"
              style={{ marginBottom: "24px", maxWidth: "800px" }}
            >
              {heroTitle.split("innovators").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span style={{ color: "var(--electric-blue)" }}>
                      innovators
                    </span>
                  )}
                </span>
              ))}
            </h1>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                maxWidth: "700px",
                lineHeight: 1.6,
                marginBottom: "40px",
                whiteSpace: "pre-wrap",
              }}
            >
              {heroSubtitle}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <a
                href="mailto:industry@purdueieee.org"
                className="btn-primary"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Mail size={18} />
                Become a Partner
              </a>
              {settings?.partnersProspectusUrl && (
                <a
                  href={settings.partnersProspectusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Download size={18} />
                  Sponsorship Prospectus
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Grid Section */}
      <section style={{ padding: "64px 0 128px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
          }}
        >
          {/* IEEE Gold Partner Recognition Callout */}
          <div
            className="glass-card"
            style={{
              padding: "20px 24px",
              marginBottom: "48px",
              borderLeft: "4px solid var(--cyber-gold)",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              background: "rgba(235, 211, 169, 0.04)",
            }}
          >
            <Award
              size={20}
              style={{
                color: "var(--cyber-gold)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <div>
              <p
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--cyber-gold)",
                  marginBottom: "4px",
                  letterSpacing: "0.03em",
                }}
              >
                IEEE Exemplary Student Branch — Gold Partner Recognition
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Gold Partner status is awarded by IEEE to student branches
                that demonstrate exceptional technical activity, community
                impact, and organizational excellence. Purdue IEEE has earned
                this recognition through consistent leadership in engineering
                education, record member engagement, and nationally recognized
                technical projects. Gold Partners receive premium placement at
                our recruiting events and direct access to our most
                accomplished members.
              </p>
            </div>
          </div>

          {/* Conditional Tier Breakdown or Unified Sponsors Grid */}
          {showCorporateTiers ? (
            <>
              {/* Gold Tier */}
              {goldPartners.length > 0 && (
                <div style={{ marginBottom: "80px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "32px",
                    }}
                  >
                    <Award style={{ color: "var(--cyber-gold)" }} size={24} />
                    <h2
                      style={{
                        fontFamily: "var(--font-headline)",
                        fontSize: "1.5rem",
                        color: "var(--text-primary)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Gold Partners
                    </h2>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, var(--glass-border), transparent)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {goldPartners.map((p) => (
                      <PartnerCard
                        key={p.domain || p.name}
                        partner={p}
                        isLight={isLight}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Silver Tier */}
              {silverPartners.length > 0 && (
                <div style={{ marginBottom: "80px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "32px",
                    }}
                  >
                    <Shield style={{ color: "var(--text-secondary)" }} size={24} />
                    <h2
                      style={{
                        fontFamily: "var(--font-headline)",
                        fontSize: "1.25rem",
                        color: "var(--text-primary)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Silver Partners
                    </h2>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, var(--glass-border), transparent)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {silverPartners.map((p) => (
                      <PartnerCard
                        key={p.domain || p.name}
                        partner={p}
                        isLight={isLight}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bronze Tier */}
              {bronzePartners.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "32px",
                    }}
                  >
                    <Cpu style={{ color: "#CD7F32" }} size={24} />
                    <h2
                      style={{
                        fontFamily: "var(--font-headline)",
                        fontSize: "1.1rem",
                        color: "var(--text-primary)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Bronze Partners
                    </h2>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, var(--glass-border), transparent)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {bronzePartners.map((p) => (
                      <PartnerCard
                        key={p.domain || p.name}
                        partner={p}
                        isLight={isLight}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Unified Sponsors Directory Grid */
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                <Award style={{ color: "var(--cyber-gold)" }} size={24} />
                <h2
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "1.5rem",
                    color: "var(--text-primary)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Our Corporate Partners & Sponsors
                </h2>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(90deg, var(--glass-border), transparent)",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {partners.map((p) => (
                  <PartnerCard
                    key={p.domain || p.name}
                    partner={p}
                    isLight={isLight}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "100px 0",
          background: "rgba(0, 98, 155, 0.03)",
          borderTop: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 32px",
            textAlign: "center",
          }}
        >
          <Rocket
            size={48}
            style={{ color: "var(--electric-blue)", marginBottom: "24px" }}
          />
          <h2 className="text-heading-2" style={{ marginBottom: "16px" }}>
            Interested in partnering with us?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "32px",
              lineHeight: 1.6,
            }}
          >
            Partnering with Purdue IEEE gives you direct access to over 400+
            motivated engineering students through tech talks, recruitment
            events, and project sponsorships.
          </p>
          <a
            href="mailto:industry@purdueieee.org"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Contact Industrial Relations
          </a>
        </div>
      </section>
    </div>
  );
}

function PartnerCard({
  partner,
  isLight,
}: {
  partner: Partner;
  isLight: boolean;
}) {
  const [logoError, setLogoError] = useState(false);
  const [useFavicon, setUseFavicon] = useState(false);

  // Resolve source: Sanity URL -> unavatar clearbit proxy -> Google S2 favicon
  let logoSrc = partner.logoUrl;
  if (!logoSrc && partner.domain) {
    if (useFavicon) {
      logoSrc = `https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`;
    } else {
      logoSrc = `https://unavatar.io/clearbit/${partner.domain}`;
    }
  }

  const handleImageError = () => {
    if (!useFavicon && partner.domain) {
      setUseFavicon(true);
    } else {
      setLogoError(true);
    }
  };

  const showLogo = logoSrc && !logoError;
  const destinationUrl = partner.websiteUrl || (partner.domain ? `https://${partner.domain}` : undefined);

  const cardContent = (
    <motion.div
      className="glass-card"
      whileHover={{ y: -5 }}
      title={`${partner.name}${partner.tier ? ` — ${partner.tier} Partner` : ""}`}
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        background: isLight
          ? "rgba(255,255,255,0.5)"
          : "rgba(255,255,255,0.02)",
        height: "100%",
        minHeight: "130px",
      }}
    >
      {showLogo ? (
        <img
          src={logoSrc}
          alt={`${partner.name} logo`}
          width={180}
          height={48}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          style={{
            maxHeight: "48px",
            maxWidth: "85%",
            filter:
              isLight || partner.logoUrl
                ? "none"
                : "brightness(0) invert(1) brightness(1.5) opacity(0.9)",
            objectFit: "contain",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1.05rem",
            color: "var(--cyber-gold)",
            textAlign: "center",
          }}
        >
          {partner.name}
        </div>
      )}

      {showLogo && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            textAlign: "center",
          }}
        >
          {partner.name}
        </span>
      )}
    </motion.div>
  );

  if (destinationUrl) {
    return (
      <a
        href={destinationUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${partner.name}${partner.tier ? ` (${partner.tier} Partner)` : ""} website`}
        style={{ display: "block", height: "100%", textDecoration: "none" }}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
