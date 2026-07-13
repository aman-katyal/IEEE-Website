import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Users, Trophy, Cpu, ChevronRight, Calendar, Globe, MessageCircle, ExternalLink, UserCircle, AlertCircle, Github, Instagram, Linkedin, Twitter, Slack, Youtube, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { useCommittee } from "../../hooks/useSanityData";
import { Skeleton } from "boneyard-js/react";
import ReactMarkdown from "react-markdown";
import type { CommitteeSection } from "../../data/committees/types";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

/** 
 * Custom Discord Icon Component 
 */
const DiscordIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.077 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.077 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.419-2.157 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

/** 
 * Intelligent icon detection based on platform name or URL 
 */
function getPlatformIcon(platform: string = "", url: string = "", size: number = 16) {
  const combined = (platform + url).toLowerCase();
  if (combined.includes("discord")) return <DiscordIcon size={size} />;
  if (combined.includes("github")) return <Github size={size} />;
  if (combined.includes("instagram")) return <Instagram size={size} />;
  if (combined.includes("linkedin")) return <Linkedin size={size} />;
  if (combined.includes("twitter") || combined.includes("x.com")) return <Twitter size={size} />;
  if (combined.includes("slack")) return <Slack size={size} />;
  if (combined.includes("youtube")) return <Youtube size={size} />;
  if (combined.includes("mailto") || combined.includes("@")) return <Mail size={size} />;
  return <Globe size={size} />;
}

export function CommitteePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { committee, loading, error } = useCommittee(id ?? "");
  const { theme } = useTheme();
  const isLight = theme === "light";

  const { textSections, projectsSections, gallerySections, faqSections, contactSections } = useMemo(() => {
    if (!committee || !committee.sections) {
      return { textSections: [], projectsSections: [], gallerySections: [], faqSections: [], contactSections: [] };
    }
    return {
      textSections: committee.sections.filter(s => s.type === "text"),
      projectsSections: committee.sections.filter(s => s.type === "projects"),
      gallerySections: committee.sections.filter(s => s.type === "gallery"),
      faqSections: committee.sections.filter(s => s.type === "faq"),
      contactSections: committee.sections.filter(s => s.type === "contact")
    };
  }, [committee]);

  if (error || (!loading && !committee)) {
    return (
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 32px 80px", textAlign: "center", background: "var(--boiler-black)" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "48px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
          {error ? "Error Loading Committee" : "Committee Not Found"}
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>
          {error ? error.message : "The committee you're looking for doesn't exist or may have been moved."}
        </p>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--electric-blue)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </section>
    );
  }

  const renderJoinButton = () => {
    if (!committee) return null;
    const config = committee.joinConfig;
    
    if (!config || config.type === "default") {
      return (
        <button onClick={() => navigate("/join")} className="btn-primary" style={{ width: "100%", textAlign: "center", padding: "18px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          Join This Committee <ChevronRight size={18} />
        </button>
      );
    }

    if (config.type === "link") {
      const url = config.url || "";
      const isExternal = url.startsWith('http');
      const isDiscord = url.toLowerCase().includes("discord");
      
      return (
        <button 
          onClick={() => isExternal ? window.open(url) : navigate(url || "/join")} 
          className="btn-primary" 
          style={{ 
            width: "100%", 
            textAlign: "center", 
            padding: "18px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "12px",
            background: isDiscord ? "#5865F2" : "var(--electric-blue)" 
          }}
        >
          {getPlatformIcon("", url, 20)}
          <span style={{ fontWeight: 600 }}>{config.buttonText || "Join Us"}</span>
          {isExternal ? <ExternalLink size={16} style={{ opacity: 0.8 }} /> : <ChevronRight size={18} />}
        </button>
      );
    }

    if (config.type === "message") {
      return (
        <div style={{ padding: "20px", background: "rgba(235, 211, 169, 0.05)", border: "1px solid var(--glass-border)", borderRadius: "4px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <AlertCircle size={18} style={{ color: "var(--cyber-gold)", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {config.message || "We are not currently accepting new members. Please check back later!"}
          </p>
        </div>
      );
    }

    return null;
  };

  const renderSection = (section: CommitteeSection, index: number) => {
    switch (section.type) {
      case "text":
        const layout = section.layout || "top";
        const isCrop = section.imageStyle?.crop !== false;
        const size = section.imageStyle?.size || "large";
        const widthMap = { small: "250px", medium: "400px", large: "600px", full: "100%" };

        return (
          <div key={index} style={{ marginBottom: "64px" }}>
            <p className="section-eyebrow" style={{ marginBottom: "20px" }}>// {section.title || "Information"}</p>
            <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: layout === "top" ? "column" : layout === "left" ? "row" : "row-reverse", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {section.image && (
                <div style={{ flex: layout === "top" ? "1 1 100%" : `0 0 ${widthMap[size]}`, maxWidth: "100%", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.1)" }}>
                  <img src={section.image} alt={section.title} style={{ width: "100%", height: "auto", maxHeight: layout === "top" ? "500px" : "600px", objectFit: isCrop ? "cover" : "contain", display: "block" }} />
                </div>
              )}
              <div style={{ flex: "1 1 300px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "15.5px", color: "var(--text-secondary)", lineHeight: 1.85 }}>
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "projects":
        const projCrop = section.imageStyle?.crop !== false;
        return (
          <div key={index} style={{ marginBottom: "64px" }}>
            <p className="section-eyebrow" style={{ marginBottom: "20px" }}>// {section.title || "Projects"}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {section.items?.map((p, i) => (
                <div key={i} className="glass-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {p.image && <div style={{ height: "180px", width: "100%", borderBottom: "1px solid var(--glass-border)" }}><img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: projCrop ? "cover" : "contain", background: "rgba(0,0,0,0.05)" }} /></div>}
                  <div style={{ padding: "24px" }}><h3 style={{ fontFamily: "var(--font-headline)", fontSize: "17px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>{p.name}</h3><div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65 }}><ReactMarkdown>{p.description}</ReactMarkdown></div></div>
                </div>
              ))}
            </div>
          </div>
        );

      case "contact":
        return (
          <div key={index} style={{ marginBottom: "64px" }}>
            <p className="section-eyebrow" style={{ marginBottom: "20px" }}>// {section.title || "Contact"}</p>
            <div className="glass-card" style={{ padding: "32px", display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(0, 98, 155, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--glass-border)" }}><UserCircle size={32} style={{ color: "var(--electric-blue)" }} /></div>
              <div><h4 style={{ fontFamily: "var(--font-headline)", fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{section.name}</h4>{section.role && <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--cyber-gold)", textTransform: "uppercase", marginBottom: "8px" }}>{section.role}</p>}<a href={`mailto:${section.email}`} style={{ color: "var(--electric-blue)", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} /> {section.email}</a></div>
            </div>
          </div>
        );

      case "gallery":
        return (
          <div key={index} style={{ marginBottom: "64px" }}>
            <p className="section-eyebrow" style={{ marginBottom: "20px" }}>// {section.title || "Gallery"}</p>
            <div style={{ columns: "2 300px", columnGap: "16px" }}>
              {section.items?.map((img: any, i) => (
                <div key={i} style={{ breakInside: "avoid", marginBottom: "16px", position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--glass-border)", cursor: "pointer" }} className="gallery-item-container">
                  <img src={img.image || img.src} alt={img.caption} style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.6s ease", filter: isLight ? "brightness(1)" : "brightness(0.85)" }} />
                  {img.caption && <div className="caption-overlay" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", padding: "24px 16px 12px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#FFFFFF", letterSpacing: "0.06em", opacity: 0, transform: "translateY(10px)", transition: "all 0.3s ease" }}>{img.caption}</div>}
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div key={index} style={{ marginBottom: "64px" }}>
            <p className="section-eyebrow" style={{ marginBottom: "20px" }}>// {section.title || "FAQ"}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {section.items?.map((faq, i) => (
                <div key={i} className="glass-card" style={{ padding: "24px 32px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}><MessageCircle size={16} style={{ color: "var(--electric-blue)", flexShrink: 0, marginTop: "2px" }} /><h4 style={{ fontFamily: "var(--font-headline)", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.45 }}>{faq.question}</h4></div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, paddingLeft: "28px" }}><ReactMarkdown>{faq.answer}</ReactMarkdown></div>
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <>
      <Skeleton name="committee-banner" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
        <section style={{ position: "relative", minHeight: "360px", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${committee?.image}')`, backgroundSize: "cover", backgroundPosition: "center 40%", filter: isLight ? "brightness(0.9) saturate(1.1)" : "brightness(0.35) saturate(0.7)" }} />
          <div style={{ position: "absolute", inset: 0, background: isLight ? "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 30%, rgba(248,250,252,0.85) 80%, var(--boiler-black) 100%)" : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 80%, var(--boiler-black) 100%)" }} />
          <div className="ieee-grid-bg" style={{ position: "absolute", inset: 0, opacity: isLight ? 0.4 : 0.6 }} />
          <div style={{ position: "relative", zIndex: 5, maxWidth: "1280px", margin: "0 auto", padding: "120px 32px 24px", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", gap: "40px" }}>
              <Link 
                to="/committees" 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  color: "var(--text-secondary)", 
                  textDecoration: "none", 
                  fontFamily: "var(--font-mono)", 
                  fontSize: "0.65rem", 
                  letterSpacing: "0.12em", 
                  textTransform: "uppercase", 
                  transition: "all 0.2s ease", 
                  opacity: isLight ? 1 : 0.75,
                  height: "28px", 
                  lineHeight: "28px"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--electric-blue)"; e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.opacity = isLight ? "1" : "0.75"; }}
              >
                <ArrowLeft size={14} style={{ position: "relative", top: "-1px" }} /> Home / Committees
              </Link>

              <div 
                className="status-badge" 
                style={{ 
                  background: committee?.statusBg || "rgba(0, 98, 155, 0.1)", 
                  color: committee?.statusColor || "var(--electric-blue)", 
                  backdropFilter: "blur(12px)", 
                  margin: 0,
                  display: "inline-flex",
                  padding: "0 14px",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  borderRadius: "100px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  alignItems: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  height: "28px",
                  lineHeight: "28px"
                }}
              >
                <div style={{ 
                  width: "6px", 
                  height: "6px", 
                  borderRadius: "50%", 
                  marginRight: "10px", 
                  background: "currentColor",
                  boxShadow: "0 0 10px currentColor",
                  flexShrink: 0
                }} />
                {committee?.status || "Active"}
              </div>
            </div>
            
            <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px", maxWidth: "800px" }}>{committee?.name}</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--cyber-gold)", letterSpacing: "0.12em", textTransform: "uppercase", opacity: isLight ? 1 : 0.8, fontWeight: isLight ? 600 : 400 }}>{committee?.tagline}</p>
          </div>
        </section>
      </Skeleton>

      <section style={{ background: "var(--boiler-black)", padding: "56px 0 120px", position: "relative" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
            
            {/* Row 1: About & Details Sidebar */}
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 340px", 
                gap: "40px", 
                alignItems: "start" 
              }}
              className="ieee-grid-sidebar"
            >
              {/* Left Column: About & Text Sections */}
              <div>
                <Skeleton name="committee-content" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
                  <div style={{ marginBottom: "32px" }}>
                    <p className="section-eyebrow" style={{ marginBottom: "16px" }}>// About This Committee</p>
                    <div className="glass-card" style={{ padding: "24px" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                        {committee?.longDescription}
                      </div>
                    </div>
                  </div>
                  {textSections.map((section, i) => renderSection(section, i))}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "20px" }}>
                    {committee?.tags?.map((tag) => <span key={tag} className="tech-tag" style={{ opacity: isLight ? 1 : 0.9, padding: "5px 10px" }}>{tag}</span>)}
                  </div>
                </Skeleton>
              </div>

              {/* Right Column: Key Details & Join CTA */}
              <aside>
                <Skeleton name="committee-sidebar" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
                  <div className="glass-card" style={{ padding: "28px", position: "sticky", top: "112px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", color: "var(--electric-blue)", textTransform: "uppercase", marginBottom: "20px", opacity: isLight ? 1 : 0.9 }}>// Committee Details</div>
                    
                    {/* Metrics */}
                    {committee?.metrics && committee.metrics.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: `repeat(${committee.metrics.length}, 1fr)`, gap: "0", borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)", padding: "16px 0", marginBottom: "24px" }}>
                        {committee.metrics.map((m, i) => (
                          <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", borderRight: i < (committee.metrics?.length || 0) - 1 ? "1px solid var(--glass-border)" : "none" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "17px", fontWeight: 600, color: "var(--electric-blue)", lineHeight: 1 }}>{m.value}</span>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", opacity: isLight ? 1 : 0.8 }}>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Chair */}
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Committee Chair</div>
                      <div style={{ fontFamily: "var(--font-headline)", fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>{committee?.chair}</div>
                      <a href={`mailto:${committee?.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--electric-blue)", textDecoration: "none" }}><Mail size={12} style={{ flexShrink: 0 }} /> {committee?.email}</a>
                    </div>

                    {renderJoinButton()}
                  </div>
                </Skeleton>
              </aside>
            </div>

            {/* Row 2: Projects (Full Width) */}
            {projectsSections.length > 0 && (
              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "48px" }}>
                <Skeleton name="committee-projects" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
                  {projectsSections.map((section, i) => renderSection(section, i))}
                </Skeleton>
              </div>
            )}

            {/* Row 3: Media & FAQ/Contact (Split Column Row) */}
            {(gallerySections.length > 0 || faqSections.length > 0 || contactSections.length > 0) && (
              <div 
                style={{ 
                  borderTop: "1px solid var(--glass-border)", 
                  paddingTop: "48px",
                  display: "grid",
                  gridTemplateColumns: (gallerySections.length > 0 && (faqSections.length > 0 || contactSections.length > 0)) ? "1.2fr 0.8fr" : "1fr",
                  gap: "48px"
                }}
                className="ieee-grid-sidebar"
              >
                {/* Left Column: Gallery/Media */}
                {gallerySections.length > 0 && (
                  <div>
                    <Skeleton name="committee-gallery" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
                      {gallerySections.map((section, i) => renderSection(section, i))}
                    </Skeleton>
                  </div>
                )}

                {/* Right Column: FAQ & Contacts */}
                {(faqSections.length > 0 || contactSections.length > 0) && (
                  <div>
                    <Skeleton name="committee-faq" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
                      {faqSections.map((section, i) => renderSection(section, i))}
                      {contactSections.map((section, i) => renderSection(section, i))}
                    </Skeleton>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>
      <style>{`.gallery-item-container:hover .caption-overlay { opacity: 1 !important; transform: translateY(0) !important; } .gallery-item-container:hover img { filter: brightness(1) !important; transform: scale(1.05); } .social-tag:hover { border-color: var(--electric-blue); color: var(--electric-blue); background: rgba(0, 98, 155, 0.05); }`}</style>
    </>
  );
}
