import { Mail, Users, User, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useLeaders, useOfficersConfig } from "../../hooks/useSanityData";
import { Skeleton } from "boneyard-js/react";
import { MagneticWrapper } from "../components/ui/MagneticWrapper";
import { Leader } from "../../data/leadership";
import { useIsMobile } from "../components/ui/use-mobile";
import * as Accordion from "@radix-ui/react-accordion";

export function OfficersPage() {
  const { leaders, loading: leadersLoading, error: leadersError } = useLeaders();
  const { config, loading: configLoading, error: configError } = useOfficersConfig();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const isMobile = useIsMobile();

  const loading = leadersLoading || configLoading;
  const error = leadersError || configError;

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--boiler-black)", color: "var(--text-secondary)" }}>
        Error loading officers: {error.message}
      </div>
    );
  }

  // Define categories and their display names
  const categories = [
    { id: "executive", name: "Executive Committee", description: "The core leadership responsible for the branch's strategic direction and administration." },
    { id: "technical", name: "Technical Committee Chairs", description: "Project leads who manage our engineering teams and technical projects." },
    { id: "operations", name: "Operational Leads", description: "Officers managing infrastructure, corporate relations, and internal logistics." },
    { id: "member", name: "Member Involvement", description: "Dedicated leads focused on student engagement, social events, and recruitment." },
  ];

  // Group and order leaders
  const getOrderedLeaders = (categoryId: string) => {
    const categoryLeaders = leaders.filter((l: Leader) => {
      // Use explicit category if available
      if (l.category) return l.category === categoryId;

      // Fallback logic in JS
      const role = l.role || "";
      let inferredCategory = "member";
      
      if (role.includes("President") || role.includes("Secretary") || role.includes("Treasurer")) {
        inferredCategory = "executive";
      } else if (role.includes("Chair") || role.includes("Lead") || role.includes("MTT-S") || role.includes("AESC") || role.includes("EMBS") || role.includes("SMC") || role.includes("CSOCIETY") || role.includes("RACING") || role.includes("SOFTWARE SATURDAYS")) {
        inferredCategory = "technical";
      } else if (role.includes("Head of") || role.includes("Infrastructure") || role.includes("Industrial") || role.includes("Operations")) {
        inferredCategory = "operations";
      }

      return inferredCategory === categoryId;
    });
    
    if (!config) return categoryLeaders;

    const orderArray = categoryId === "executive" ? config.executiveOrder :
                       categoryId === "technical" ? config.technicalOrder :
                       categoryId === "operations" ? config.operationsOrder :
                       config.memberOrder;

    if (!orderArray || orderArray.length === 0) return categoryLeaders;

    // Map _id from orderArray
    const orderedIds = orderArray.map((ref: any) => ref._id);
    
    // Sort categoryLeaders based on orderedIds
    const sorted = [...categoryLeaders].sort((a, b) => {
      const indexA = orderedIds.indexOf(a._id);
      const indexB = orderedIds.indexOf(b._id);
      
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return sorted;
  };

  // Define how many skeleton cards to show per section
  const skeletonCards = Array.from({ length: 4 });

  const renderOfficerCard = (officer: Leader) => (
    <MagneticWrapper key={officer._id || officer.name + officer.role} strength={0.05} className="w-full h-full">
      <div
        className="glass-card hover-glow-gold hover-scale hover-border-gold"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Image Container with masked fade */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            background: isLight ? "rgba(0, 0, 0, 0.03)" : "rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--glass-border)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {officer.image ? (
            <>
              <img 
                src={officer.image} 
                alt={officer.name} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              
              {/* Bottom Gradient Fade - Softer in Light Mode */}
              <div 
                style={{ 
                  position: "absolute", 
                  inset: 0, 
                  background: isLight 
                    ? "linear-gradient(to bottom, transparent 80%, rgba(248, 250, 252, 0.5) 100%)"
                    : "linear-gradient(to bottom, transparent 60%, rgba(10, 10, 12, 0.9) 100%)",
                  pointerEvents: "none"
                }} 
              />

              {/* Subtle Inner Shadow - Much lighter in Light Mode */}
              <div 
                style={{ 
                  position: "absolute", 
                  inset: 0, 
                  boxShadow: isLight 
                    ? "inset 0 0 20px rgba(0,0,0,0.03)" 
                    : "inset 0 0 40px rgba(0,0,0,0.2)",
                  pointerEvents: "none"
                }} 
              />

              {/* Stylized Tech Accents - More prominent */}
              <div style={{ position: "absolute", top: "10px", left: "10px", width: "16px", height: "16px", borderTop: "2px solid var(--electric-blue)", borderLeft: "2px solid var(--electric-blue)", opacity: 0.8, zIndex: 2 }} />
              <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "16px", height: "16px", borderBottom: "2px solid var(--cyber-gold)", borderRight: "2px solid var(--cyber-gold)", opacity: 0.8, zIndex: 2 }} />
            </>
          ) : (
            <User size={48} style={{ color: "var(--text-muted)", opacity: 0.3 }} />
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            {officer.name}
          </h3>
          <div
            style={{
              display: "inline-block",
              padding: "3px 10px",
              background: "rgba(0, 98, 155, 0.1)",
              border: "1px solid var(--glass-border)",
              borderRadius: "2px",
              color: "var(--electric-blue)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {officer.role}
          </div>
        </div>

        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          {officer.committees && (
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <Users size={15} style={{ color: "var(--cyber-gold)", marginTop: "3px", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Committees
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {officer.committees}
                </p>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <Mail size={15} style={{ color: "var(--electric-blue)", marginTop: "3px", flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Contact
              </p>
              <a
                href={`mailto:${officer.email}`}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--electric-blue)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {officer.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </MagneticWrapper>
  );

  return (
    <section
      style={{
        background: "var(--boiler-black)",
        minHeight: "100vh",
        padding: "120px 0 96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.25 }}
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
        {/* Header */}
        <div style={{ marginBottom: "72px", textAlign: "center" }}>
          <p className="section-eyebrow" style={{ marginBottom: "16px" }}>// Leadership Team</p>
          <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "24px" }}>
            Meet Our <span style={{ color: "var(--electric-blue)" }}>Officers</span>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto" }}>
            The dedicated students who keep Purdue IEEE running smoothly across all technical and administrative operations.
          </p>
        </div>

        <Skeleton name="officers-list" loading={loading} color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}>
          {isMobile ? (
            <Accordion.Root type="multiple" className="AccordionRoot" defaultValue={["executive"]}>
              {categories.map((cat) => {
                const sectionLeaders = getOrderedLeaders(cat.id);
                if (sectionLeaders.length === 0) return null;

                return (
                  <Accordion.Item key={cat.id} value={cat.id} className="AccordionItem" style={{ borderBottom: "1px solid var(--glass-border)", marginBottom: "12px" }}>
                    <Accordion.Header className="AccordionHeader">
                      <Accordion.Trigger className="AccordionTrigger" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>
                        <span style={{ fontFamily: "var(--font-headline)", fontSize: "20px", fontWeight: 600 }}>{cat.name}</span>
                        <ChevronDown className="AccordionChevron" aria-hidden />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="AccordionContent">
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>{cat.description}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", paddingBottom: "32px" }}>
                        {sectionLeaders.map(renderOfficerCard)}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          ) : (
            categories.map((cat) => {
              const sectionLeaders = getOrderedLeaders(cat.id);
              if (sectionLeaders.length === 0) return null;

              return (
                <div key={cat.id} style={{ marginBottom: "80px" }}>
                  <div style={{ marginBottom: "32px" }}>
                    <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "28px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: cat.id === "executive" ? "var(--cyber-gold)" : "var(--electric-blue)" }}>//</span>
                      {cat.name}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-muted)", maxWidth: "800px" }}>{cat.description}</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                    {sectionLeaders.map(renderOfficerCard)}
                  </div>
                </div>
              );
            })
          )}
        </Skeleton>
      </div>
      <style>{`
        .AccordionTrigger[data-state='open'] .AccordionChevron {
          transform: rotate(180deg);
        }
        .AccordionChevron {
          transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
          color: var(--electric-blue);
        }
        .AccordionContent {
          overflow: hidden;
        }
        .AccordionContent[data-state='open'] {
          animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1);
        }
        .AccordionContent[data-state='closed'] {
          animation: slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1);
        }
        @keyframes slideDown {
          from { height: 0; }
          to { height: var(--radix-accordion-content-height); }
        }
        @keyframes slideUp {
          from { height: var(--radix-accordion-content-height); }
          to { height: 0; }
        }
      `}</style>
    </section>
  );
}
