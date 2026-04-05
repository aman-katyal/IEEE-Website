import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Users, Trophy, Cpu, ChevronRight, Calendar, Globe, MessageCircle, ExternalLink, UserCircle, AlertCircle, Github, Instagram, Linkedin, Twitter, Slack, Youtube, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { useCommittee } from "../../hooks/useSanityData";
import { urlFor } from "../../lib/sanity";
import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import ReactMarkdown from "react-markdown";
import type { CommitteeSection } from "../../data/committees/types";

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
        <Button 
          onClick={() => navigate("/join")} 
          className="w-full py-7 text-base font-semibold gap-3"
        >
          Join This Committee <ChevronRight size={18} />
        </Button>
      );
    }

    if (config.type === "link") {
      const url = config.url || "";
      const isExternal = url.startsWith('http');
      const isDiscord = url.toLowerCase().includes("discord");
      
      return (
        <Button 
          asChild={isExternal}
          onClick={() => !isExternal && navigate(url || "/join")}
          className="w-full py-7 text-base font-semibold gap-3"
          style={{ 
            background: isDiscord ? "#5865F2" : undefined,
            borderColor: isDiscord ? "#5865F2" : undefined
          }}
        >
          {isExternal ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 no-underline">
              {getPlatformIcon("", url, 20)}
              <span>{config.buttonText || "Join Us"}</span>
              <ExternalLink size={16} style={{ opacity: 0.8 }} />
            </a>
          ) : (
            <>
              {getPlatformIcon("", url, 20)}
              <span>{config.buttonText || "Join Us"}</span>
              <ChevronRight size={18} />
            </>
          )}
        </Button>
      );
    }

    if (config.type === "message") {
      return (
        <Card className="bg-[rgba(235,211,169,0.05)] border-[var(--glass-border)] shadow-none">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertCircle size={18} className="text-[var(--cyber-gold)] shrink-0 mt-0.5" />
            <p className="font-body text-[13.5px] text-[var(--text-secondary)] leading-relaxed">
              {config.message || "We are not currently accepting new members. Please check back later!"}
            </p>
          </CardContent>
        </Card>
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
          <div key={index} className="mb-16">
            <p className="section-eyebrow mb-5">// {section.title || "Information"}</p>
            <Card className="glass-card flex flex-col border-none shadow-none p-8" style={{ flexDirection: layout === "top" ? "column" : layout === "left" ? "row" : "row-reverse", gap: "32px", alignItems: "flex-start" }}>
              {section.image && (
                <div 
                  className="shrink-0 overflow-hidden border border-[var(--glass-border)] bg-black/10 rounded-sm"
                  style={{ flex: layout === "top" ? "1 1 100%" : `0 0 ${widthMap[size]}`, maxWidth: "100%" }}
                >
                  <img 
                    src={section.image?.asset ? urlFor(section.image).width(1000).auto('format').url() : section.image} 
                    alt={section.title} 
                    className="w-full h-auto block" 
                    style={{ maxHeight: layout === "top" ? "500px" : "600px", objectFit: isCrop ? "cover" : "contain" }} 
                  />
                </div>
              )}
              <CardContent className="p-0 flex-1 min-w-[300px]">
                <div className="font-body text-[15.5px] text-[var(--text-secondary)] leading-loose">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "projects":
        const projCrop = section.imageStyle?.crop !== false;
        return (
          <div key={index} className="mb-16">
            <p className="section-eyebrow mb-5">// {section.title || "Projects"}</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {section.items.map((p, i) => (
                <Card key={i} className="glass-card flex flex-col overflow-hidden border-none shadow-none">
                  {p.image && (
                    <div className="h-[180px] w-full border-b border-[var(--glass-border)]">
                      <img 
                        src={p.image?.asset ? urlFor(p.image).width(600).auto('format').url() : p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover bg-black/5" 
                        style={{ objectFit: projCrop ? "cover" : "contain" }} 
                      />
                    </div>
                  )}
                  <CardHeader className="p-6">
                    <CardTitle className="font-headline text-[17px] font-semibold text-[var(--text-primary)]">
                      {p.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 font-body text-[14px] text-[var(--text-secondary)] leading-relaxed">
                    <ReactMarkdown>{p.description}</ReactMarkdown>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "contact":
        return (
          <div key={index} className="mb-16">
            <p className="section-eyebrow mb-5">// {section.title || "Contact"}</p>
            <Card className="glass-card border-none shadow-none">
              <CardContent className="flex items-center gap-6 p-8">
                <div className="w-16 h-16 rounded-full bg-[var(--electric-blue)]/10 flex items-center justify-center border border-[var(--glass-border)]">
                  <UserCircle size={32} className="text-[var(--electric-blue)]" />
                </div>
                <div>
                  <h4 className="font-headline text-[18px] font-semibold text-[var(--text-primary)] mb-1">{section.name}</h4>
                  {section.role && (
                    <p className="font-mono text-[0.7rem] text-[var(--cyber-gold)] uppercase mb-2">
                      {section.role}
                    </p>
                  )}
                  <a 
                    href={`mailto:${section.email}`} 
                    className="text-[var(--electric-blue)] no-underline text-sm flex items-center gap-1.5 transition-opacity hover:opacity-80"
                  >
                    <Mail size={14} /> {section.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "gallery":
        return (
          <div key={index} className="mb-16">
            <p className="section-eyebrow mb-5">// {section.title || "Gallery"}</p>
            <div className="columns-2 md:columns-3 gap-4">
              {section.items.map((img: any, i) => (
                <div key={i} className="gallery-item-container relative mb-4 break-inside-avoid rounded-lg overflow-hidden border border-[var(--glass-border)] cursor-pointer group">
                  <img 
                    src={(img.image?.asset || img.src?.asset) ? urlFor(img.image || img.src).width(800).auto('format').url() : (img.image || img.src)} 
                    alt={img.caption} 
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" 
                    style={{ filter: isLight ? "brightness(1)" : "brightness(0.85)" }} 
                  />
                  {img.caption && (
                    <div className="caption-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12 font-mono text-[0.65rem] text-white tracking-wider opacity-0 translate-y-2.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div key={index} className="mb-16">
            <p className="section-eyebrow mb-5">// {section.title || "FAQ"}</p>
            <Accordion type="single" collapsible className="w-full flex flex-col gap-3">
              {section.items.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`} 
                  className="glass-card border-none px-6 py-1"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <MessageCircle size={16} className="text-[var(--electric-blue)] shrink-0 mt-0.5" />
                      <span className="font-headline text-[15px] font-semibold text-[var(--text-primary)] leading-tight">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-[14px] text-[var(--text-secondary)] leading-relaxed pl-7 pb-6">
                    <ReactMarkdown>{faq.answer}</ReactMarkdown>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        );

      default: return null;
    }
  };

  return (
    <>
      <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {loading ? (
          <Skeleton style={{ position: "absolute", inset: 0, background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${committee?.image?.asset ? urlFor(committee.image).width(1920).auto('format').url() : committee?.image}')`, backgroundSize: "cover", backgroundPosition: "center 40%", filter: isLight ? "brightness(0.9) saturate(1.1)" : "brightness(0.35) saturate(0.7)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: isLight ? "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 30%, rgba(248,250,252,0.85) 80%, var(--boiler-black) 100%)" : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 80%, var(--boiler-black) 100%)" }} />
        <div className="ieee-grid-bg" style={{ position: "absolute", inset: 0, opacity: isLight ? 0.4 : 0.6 }} />
        <div style={{ position: "relative", zIndex: 5, maxWidth: "1280px", margin: "0 auto", padding: "0 32px 48px", width: "100%" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "32px", transition: "color 0.2s ease", opacity: isLight ? 1 : 0.8 }}><ArrowLeft size={14} /> Home / Committees</Link>
          
          {loading ? (
            <>
              <Skeleton style={{ height: "24px", width: "120px", marginBottom: "20px", background: "rgba(255,255,255,0.1)" }} />
              <Skeleton style={{ height: "64px", width: "60%", marginBottom: "12px", background: "rgba(255,255,255,0.1)" }} />
              <Skeleton style={{ height: "20px", width: "30%", background: "rgba(255,255,255,0.1)" }} />
            </>
          ) : (
            <>
              <div className="status-badge" style={{ background: committee?.statusBg, color: committee?.statusColor, backdropFilter: "blur(6px)", marginBottom: "20px" }}><span className="dot" />{committee?.status}</div>
              <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px", maxWidth: "800px" }}>{committee?.name}</h1>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--cyber-gold)", letterSpacing: "0.12em", textTransform: "uppercase", opacity: isLight ? 1 : 0.8, fontWeight: isLight ? 600 : 400 }}>{committee?.tagline}</p>
            </>
          )}
        </div>
      </section>

      <div style={{ background: "var(--boiler-black)", position: "relative" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "64px", alignItems: "flex-start" }} className="committee-main-grid">
            {/* Left Column: Content */}
            <div style={{ minWidth: 0 }}>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                  {[1, 2].map(i => (
                    <div key={i}>
                      <Skeleton style={{ height: "20px", width: "100px", marginBottom: "16px", background: "rgba(255,255,255,0.05)" }} />
                      <div className="glass-card" style={{ padding: "32px" }}>
                        <Skeleton style={{ height: "200px", width: "100%", background: "rgba(255,255,255,0.05)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                committee?.sections?.map(renderSection)
              )}
            </div>

            {/* Right Column: Sidebar */}
            <aside style={{ position: "sticky", top: "120px" }}>
              {loading ? (
                <div className="glass-card" style={{ padding: "32px" }}>
                  <Skeleton style={{ height: "24px", width: "150px", marginBottom: "24px", background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton style={{ height: "56px", width: "100%", background: "rgba(255,255,255,0.05)" }} />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div className="glass-card" style={{ padding: "32px" }}>
                    <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", borderLeft: "3px solid var(--electric-blue)", paddingLeft: "12px" }}>Get Involved</h3>
                    {renderJoinButton()}
                  </div>

                  <div className="glass-card" style={{ padding: "32px" }}>
                    <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", borderLeft: "3px solid var(--cyber-gold)", paddingLeft: "12px" }}>Details</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Committee Chair</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-primary)", fontWeight: 500 }}>{committee?.chair}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Contact Email</p>
                        <a href={`mailto:${committee?.email}`} style={{ fontFamily: "var(--font-mono)", fontSize: "13.5px", color: "var(--electric-blue)", textDecoration: "none" }}>{committee?.email}</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
