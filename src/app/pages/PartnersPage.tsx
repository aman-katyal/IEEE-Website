import { useEffect } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { ExternalLink, Mail, Award, Rocket, Shield, Cpu } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const partners = [
  { name: "Texas Instruments", domain: "ti.com", tier: "Gold" },
  { name: "Qualcomm", domain: "qualcomm.com", tier: "Gold" },
  { name: "SpaceX", domain: "spacex.com", tier: "Gold" },
  { name: "Intel", domain: "intel.com", tier: "Gold" },
  { name: "NVIDIA", domain: "nvidia.com", tier: "Gold" },
  { name: "Lockheed Martin", domain: "lockheedmartin.com", tier: "Silver" },
  { name: "Raytheon Technologies", domain: "rtx.com", tier: "Silver" },
  { name: "Northrop Grumman", domain: "northropgrumman.com", tier: "Silver" },
  { name: "Boeing", domain: "boeing.com", tier: "Silver" },
  { name: "L3Harris", domain: "l3harris.com", tier: "Silver" },
  { name: "AMD", domain: "amd.com", tier: "Bronze" },
  { name: "Apple", domain: "apple.com", tier: "Bronze" },
  { name: "Cisco", domain: "cisco.com", tier: "Bronze" },
  { name: "Honeywell", domain: "honeywell.com", tier: "Bronze" },
  { name: "Caterpillar", domain: "caterpillar.com", tier: "Bronze" },
];

export function PartnersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const revealProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
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
              Empowering the next generation of <span style={{ color: "var(--electric-blue)" }}>innovators</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "700px", lineHeight: 1.6, marginBottom: "40px" }}>
              Our partners provide the resources, mentorship, and opportunities that allow our members to push the boundaries of what's possible in engineering.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild className="gap-2 px-6 py-6 text-base">
                <a href="mailto:industry@purdueieee.org" className="no-underline">
                  <Mail size={18} />
                  Become a Partner
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2 px-6 py-6 text-base border-[var(--glass-border)] hover:bg-white/5">
                <a href="/documents/constitution/Constitution_of_IEEE.pdf" target="_blank" className="no-underline">
                  Download Prospectus
                  <ExternalLink size={16} />
                </a>
              </Button>
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
                <PartnerCard key={p.domain} partner={p} isLight={isLight} />
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
                <PartnerCard key={p.domain} partner={p} isLight={isLight} />
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
                <PartnerCard key={p.domain} partner={p} isLight={isLight} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--electric-blue)]/5 border-t border-[var(--glass-border)]">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <Rocket size={48} className="text-[var(--electric-blue)] mx-auto mb-6" />
          <h2 className="text-3xl font-headline font-bold text-[var(--text-primary)] mb-4">Interested in partnering with us?</h2>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            Partnering with Purdue IEEE gives you direct access to over 400+ motivated engineering students through tech talks, recruitment events, and project sponsorships.
          </p>
          <Button asChild className="px-8 py-6 text-base">
            <a href="mailto:industry@purdueieee.org" className="no-underline">
              Contact Industrial Relations
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ partner, isLight }: { partner: any, isLight: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className="glass-card h-full flex flex-col items-center justify-center gap-4 border-none shadow-none p-8"
        style={{ 
          background: isLight ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.02)",
          minHeight: partner.tier === "Gold" ? "180px" : "140px"
        }}
      >
        <CardContent className="p-0 flex flex-col items-center gap-4 w-full">
          <img 
            src={`https://logo.clearbit.com/${partner.domain}`} 
            alt={partner.name}
            loading="lazy"
            className="max-w-[80%] object-contain"
            style={{ 
              maxHeight: partner.tier === "Gold" ? "60px" : "40px", 
              filter: isLight ? "none" : "brightness(0) invert(1) opacity(0.9)",
            }} 
          />
          <span className="font-mono text-[0.7rem] text-[var(--text-muted)] uppercase tracking-widest text-center">
            {partner.name}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
