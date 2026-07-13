import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { ExternalLink, Mail, Award, Rocket, Shield, Cpu } from "lucide-react";
import { usePartners, useSiteSettings } from "../../hooks/useSanityData";

export function PartnersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { partners, loading: partnersLoading } = usePartners();

  const loading = settingsLoading || partnersLoading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        background: "var(--boiler-black)", 
        color: "var(--text-primary)" 
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div className="animate-spin" style={{ width: "40px", height: "40px", border: "3px solid var(--electric-blue)", borderTopColor: "transparent", borderRadius: "50%" }} />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Loading Partners...</p>
        </div>
      </div>
    );
  }

  // Use dynamic content from settings or fall back to current hardcoded values
  const heroTitle = settings?.partnersHeroTitle || "Empowering the next generation of innovators";
  const heroSubtitle = settings?.partnersHeroSubtitle || "Our partners provide the resources, mentorship, and opportunities that allow our members to push the boundaries of what's possible in engineering.";
  const prospectusUrl = settings?.partnersProspectusUrl || "/documents/constitution/Constitution_of_IEEE.pdf";

  const revealProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--boiler-black)" }}>
      {/* Hero Section */}
      <section style={{ padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
        <div className="ieee-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />
        
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 10 }}>
          <motion.div {...revealProps}>
            <p className="section-eyebrow" style={{ marginBottom: "16px" }}>// Corporate Relations</p>
            <h1 className="text-heading-1" style={{ marginBottom: "24px", maxWidth: "800px" }}>
              {heroTitle.split("innovators").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span style={{ color: "var(--electric-blue)" }}>innovators</span>}
                </span>
              ))}
            </h1>
            <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "700px", lineHeight: 1.6, marginBottom: "40px", whiteSpace: "pre-wrap" }}>
              {heroSubtitle}
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <a href="mailto:industry@purdueieee.org" className="btn-primary" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={18} />
                Become a Partner
              </a>
              <a href={prospectusUrl} target="_blank" className="btn-ghost" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                Download Prospectus
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Grid */}
      <section style={{ padding: "64px 0 128px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
          
          {/* Gold Tier */}
          <div style={{ marginBottom: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <Award style={{ color: "var(--cyber-gold)" }} size={24} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", color: "var(--text-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Gold Partners</h2>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--glass-border), transparent)" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {partners.filter(p => p.tier === "Gold").map(p => (
                <PartnerCard key={p.domain || p.name} partner={p} isLight={isLight} />
              ))}
            </div>
          </div>

          {/* Silver Tier */}
          <div style={{ marginBottom: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <Shield style={{ color: "var(--text-secondary)" }} size={24} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", color: "var(--text-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Silver Partners</h2>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--glass-border), transparent)" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
              {partners.filter(p => p.tier === "Silver").map(p => (
                <PartnerCard key={p.domain || p.name} partner={p} isLight={isLight} />
              ))}
            </div>
          </div>

          {/* Bronze Tier */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <Cpu style={{ color: "#CD7F32" }} size={24} />
              <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", color: "var(--text-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Bronze Partners</h2>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--glass-border), transparent)" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
              {partners.filter(p => p.tier === "Bronze").map(p => (
                <PartnerCard key={p.domain || p.name} partner={p} isLight={isLight} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 0", background: "rgba(0, 98, 155, 0.03)", borderTop: "1px solid var(--glass-border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <Rocket size={48} style={{ color: "var(--electric-blue)", marginBottom: "24px" }} />
          <h2 className="text-heading-2" style={{ marginBottom: "16px" }}>Interested in partnering with us?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
            Partnering with Purdue IEEE gives you direct access to over 400+ motivated engineering students through tech talks, recruitment events, and project sponsorships.
          </p>
          <a href="mailto:industry@purdueieee.org" className="btn-primary" style={{ textDecoration: "none" }}>
            Contact Industrial Relations
          </a>
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ partner, isLight }: { partner: any, isLight: boolean }) {
  const [logoError, setLogoError] = useState(false);
  const [useFavicon, setUseFavicon] = useState(false);
  
  // Resolve source: Sanity URL -> unavatar clearbit proxy (bypasses adblockers) -> Google S2 favicon
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

  return (
    <motion.div 
      className="glass-card" 
      whileHover={{ y: -5 }}
      style={{ 
        padding: "32px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "16px",
        background: isLight ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.02)",
        height: "100%",
        minHeight: partner.tier === "Gold" ? "180px" : "140px"
      }}
    >
      {showLogo ? (
        <img 
          src={logoSrc} 
          alt={partner.name}
          loading="lazy"
          onError={handleImageError}
          style={{ 
            maxHeight: partner.tier === "Gold" ? "60px" : "40px", 
            maxWidth: "80%", 
            filter: isLight || partner.logoUrl ? "none" : "brightness(0) invert(1) brightness(1.5) opacity(0.9)",
            objectFit: "contain"
          }} 
        />
      ) : (
        <div style={{ 
          width: "100%", 
          height: partner.tier === "Gold" ? "60px" : "40px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "1.15rem",
          color: "var(--cyber-gold)",
          textAlign: "center"
        }}>
          {partner.name}
        </div>
      )}
      
      {showLogo && (
        <span style={{ 
          fontFamily: "var(--font-mono)", 
          fontSize: "0.7rem", 
          color: "var(--text-muted)", 
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textAlign: "center"
        }}>
          {partner.name}
        </span>
      )}
    </motion.div>
  );
}


