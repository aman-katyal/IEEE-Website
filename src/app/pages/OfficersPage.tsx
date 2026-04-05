import { Mail, Users, User, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useLeaders, useOfficersConfig } from "../../hooks/useSanityData";
import { urlFor } from "../../lib/sanity";
import { Skeleton } from "../components/ui/skeleton";
import { MagneticWrapper } from "../components/ui/MagneticWrapper";
import { Leader } from "../../data/leadership";
import { useIsMobile } from "../components/ui/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

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
      <Card
        className="glass-card flex flex-col h-full transition-all duration-300 border-none shadow-none p-5 hover-glow-gold hover-scale hover-border-gold overflow-hidden"
      >
        {/* Image Container with masked fade */}
        <div
          className="relative w-full aspect-square rounded-sm mb-6 flex items-center justify-center border border-[var(--glass-border)] overflow-hidden"
          style={{
            background: isLight ? "rgba(0, 0, 0, 0.03)" : "rgba(0, 0, 0, 0.2)",
          }}
        >
          {officer.image ? (
            <>
              <img 
                src={officer.image?.asset ? urlFor(officer.image).width(400).auto('format').url() : officer.image} 
                alt={officer.name} 
                className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
              />
              
              {/* Bottom Gradient Fade - Softer in Light Mode */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                  background: isLight 
                    ? "linear-gradient(to bottom, transparent 80%, rgba(248, 250, 252, 0.5) 100%)"
                    : "linear-gradient(to bottom, transparent 60%, rgba(10, 10, 12, 0.9) 100%)",
                }} 
              />

              {/* Subtle Inner Shadow - Much lighter in Light Mode */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                  boxShadow: isLight 
                    ? "inset 0 0 20px rgba(0,0,0,0.03)" 
                    : "inset 0 0 40px rgba(0,0,0,0.2)",
                }} 
              />

              {/* Stylized Tech Accents */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[var(--electric-blue)] opacity-80 z-10" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[var(--cyber-gold)] opacity-80 z-10" />
            </>
          ) : (
            <User size={48} className="text-[var(--text-muted)] opacity-30" />
          )}
        </div>

        <div className="mb-5">
          <h3
            className="font-headline text-xl font-semibold text-[var(--text-primary)] mb-1.5"
          >
            {officer.name}
          </h3>
          <div
            className="inline-block px-2.5 py-1 bg-[var(--electric-blue)]/10 border border-[var(--glass-border)] rounded-sm text-[var(--electric-blue)] text-[11px] font-semibold uppercase tracking-wider"
          >
            {officer.role}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {officer.committees && (
            <div className="flex gap-3 items-start">
              <Users size={15} className="text-[var(--cyber-gold)] shrink-0 mt-1" />
              <div>
                <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-0.5">
                  Committees
                </p>
                <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed">
                  {officer.committees}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 items-start">
            <Mail size={15} className="text-[var(--electric-blue)] shrink-0 mt-1" />
            <div>
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-0.5">
                Contact
              </p>
              <a 
                href={`mailto:${officer.email}`}
                className="font-mono text-xs text-[var(--text-secondary)] no-underline transition-colors duration-200 hover:text-[var(--electric-blue)]"
              >
                {officer.email}
              </a>
            </div>
          </div>
        </div>
      </Card>
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

        {isMobile ? (
          <Accordion type="multiple" className="flex flex-col gap-4">
            {categories.map((cat) => {
              const sectionLeaders = getOrderedLeaders(cat.id);
              if (!loading && sectionLeaders.length === 0) return null;

              return (
                <AccordionItem 
                  key={cat.id} 
                  value={cat.id} 
                  className="glass-card border-none px-6 py-1"
                >
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex flex-col items-start text-left">
                      <h3 className="font-headline text-xl font-bold text-[var(--text-primary)]">
                        {cat.name}
                      </h3>
                      <p className="font-body text-xs text-[var(--text-muted)] mt-1">
                        {categoryLeaders.length} Members
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">
                    <p className="font-body text-[14px] text-[var(--text-muted)] mb-6">
                      {cat.description}
                    </p>
                    <div className="flex flex-col gap-6 mt-4">
                      {loading ? (
                        skeletonCards.map((_, i) => (
                          <div key={i} className="glass-card h-[400px] animate-pulse bg-white/5" />
                        ))
                      ) : (
                        sectionLeaders.map(renderOfficerCard)
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          categories.map((cat) => {
            const sectionLeaders = getOrderedLeaders(cat.id);
            if (!loading && sectionLeaders.length === 0) return null;

            return (
              <div key={cat.id} className="mb-20">
                <div className="flex items-center gap-6 mb-10">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--glass-border)]" />
                  <div className="text-center max-w-[600px]">
                    <h2 className="font-headline text-3xl font-bold text-[var(--text-primary)] mb-3">
                      {cat.name}
                    </h2>
                    <p className="font-body text-[var(--text-secondary)] text-sm leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--glass-border)]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {loading ? (
                    skeletonCards.map((_, i) => (
                      <div key={i} className="glass-card h-[450px] animate-pulse bg-white/5" />
                    ))
                  ) : (
                    sectionLeaders.map(renderOfficerCard)
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
