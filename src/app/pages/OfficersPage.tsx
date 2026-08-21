import { useMemo } from "react";
import { Mail, Users, User, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useLeaders, useOfficersConfig } from "../../hooks/useSanityData";
import { Skeleton } from "boneyard-js/react";
import { MagneticWrapper } from "../components/ui/MagneticWrapper";
import { Leader } from "../../data/leadership";
import { useIsMobile } from "../components/ui/use-mobile";
import * as Accordion from "@radix-ui/react-accordion";

import { getOrderedLeaders } from "./officersUtils";

// Define categories and their display names
const CATEGORIES = [
  {
    id: "executive",
    name: "Executive Committee",
    description:
      "The core leadership responsible for the branch's strategic direction and administration.",
  },
  {
    id: "technical",
    name: "Technical Committee Chairs",
    description:
      "Project leads who manage our engineering teams and technical projects.",
  },
  {
    id: "operations",
    name: "Operational Leads",
    description:
      "Officers managing infrastructure, corporate relations, and internal logistics.",
  },
  {
    id: "member",
    name: "Member Involvement",
    description:
      "Dedicated leads focused on student engagement, social events, and recruitment.",
  },
];

export function OfficersPage() {
  const {
    leaders,
    loading: leadersLoading,
    error: leadersError,
  } = useLeaders();
  const {
    config,
    loading: configLoading,
    error: configError,
  } = useOfficersConfig();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const isMobile = useIsMobile();

  const loading = leadersLoading || configLoading;
  const error = leadersError || configError;

  const categorizedLeaders = useMemo(() => {
    if (!leaders) return {} as Record<string, Leader[]>;
    return CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat.id] = getOrderedLeaders(leaders, config, cat.id);
        return acc;
      },
      {} as Record<string, Leader[]>,
    );
  }, [leaders, config]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--boiler-black)",
          color: "var(--text-secondary)",
        }}
      >
        Error loading officers: {error.message}
      </div>
    );
  }

  const renderOfficerCard = (officer: Leader) => (
    <MagneticWrapper
      key={officer._id || officer.name + officer.role}
      strength={0.05}
      className="w-full h-full"
    >
      <div className="glass-card hover-glow-gold hover-scale hover-border-gold p-5 flex flex-col h-full rounded-md relative overflow-hidden transition-all duration-300">
        {/* Image Container with masked fade */}
        <div className="w-full aspect-square bg-black/5 dark:bg-black/30 rounded mb-6 flex items-center justify-center border border-(--glass-border) relative overflow-hidden">
          {officer.image ? (
            <>
              <img
                src={officer.image}
                alt={officer.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
              />

              {/* Bottom Gradient Fade */}
              <div
                className={`absolute inset-0 pointer-events-none ${
                  isLight
                    ? "bg-gradient-to-b from-transparent via-transparent to-slate-100/50"
                    : "bg-gradient-to-b from-transparent via-transparent to-[#0a0a0c]/90"
                }`}
              />

              {/* Stylized Tech Accents */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-(--electric-blue) opacity-80 z-2" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-(--cyber-gold) opacity-80 z-2" />
            </>
          ) : (
            <User size={48} className="text-(--text-muted) opacity-30" />
          )}
        </div>

        <div className="mb-5">
          <h3 className="font-headline text-xl font-semibold text-(--text-primary) mb-1.5">
            {officer.name}
          </h3>
          <div className="inline-block px-2.5 py-0.5 bg-[rgba(0,98,155,0.1)] border border-(--glass-border) rounded text-(--electric-blue) text-[11px] font-semibold uppercase tracking-wider">
            {officer.role}
          </div>
        </div>

        <div className="grow flex flex-col gap-4">
          {officer.committees && (
            <div className="flex gap-3 items-start">
              <Users size={15} className="text-(--cyber-gold) mt-1 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-(--text-muted) mb-0.5 uppercase tracking-widest">
                  Committees
                </p>
                <p className="font-body text-xs text-(--text-secondary) leading-relaxed">
                  {officer.committees}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 items-start">
            <Mail size={15} className="text-(--electric-blue) mt-1 shrink-0" />
            <div>
              <p className="font-mono text-[10px] text-(--text-muted) mb-0.5 uppercase tracking-widest">
                Contact
              </p>
              <a
                href={`mailto:${officer.email}`}
                className="font-body text-xs text-(--text-secondary) hover:text-(--electric-blue) transition-colors duration-200"
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
    <section className="bg-(--boiler-black) min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="ieee-grid-bg absolute inset-0 opacity-25" />

      <div className="relative z-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-eyebrow mb-4">// Leadership Team</p>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-(--text-primary) leading-tight tracking-tight mb-6">
            Meet Our <span className="text-(--electric-blue)">Officers</span>
          </h2>
          <p className="font-body text-lg text-(--text-secondary) leading-relaxed max-w-2xl mx-auto">
            The dedicated students who keep Purdue IEEE running smoothly across
            all technical and administrative operations.
          </p>
        </div>

        <Skeleton
          name="officers-list"
          loading={loading}
          color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
        >
          {isMobile ? (
            <Accordion.Root
              type="multiple"
              className="AccordionRoot"
              defaultValue={["executive"]}
            >
              {CATEGORIES.map((cat) => {
                const sectionLeaders = categorizedLeaders[cat.id] ?? [];
                if (sectionLeaders.length === 0) return null;

                return (
                  <Accordion.Item
                    key={cat.id}
                    value={cat.id}
                    className="AccordionItem border-b border-(--glass-border) mb-3"
                  >
                    <Accordion.Header className="AccordionHeader">
                      <Accordion.Trigger className="AccordionTrigger w-full flex items-center justify-between py-5 bg-transparent border-none text-(--text-primary) cursor-pointer">
                        <span className="font-headline text-xl font-semibold">
                          {cat.name}
                        </span>
                        <ChevronDown className="AccordionChevron" aria-hidden />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="AccordionContent">
                      <p className="font-body text-sm text-(--text-muted) mb-6">
                        {cat.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
                        {sectionLeaders.map(renderOfficerCard)}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          ) : (
            CATEGORIES.map((cat) => {
              const sectionLeaders = categorizedLeaders[cat.id] ?? [];
              if (sectionLeaders.length === 0) return null;

              return (
                <div key={cat.id} className="mb-20">
                  <div className="mb-8">
                    <h3 className="font-headline text-2xl md:text-3xl font-semibold text-(--text-primary) mb-2 flex items-center gap-3">
                      <span
                        className={
                          cat.id === "executive"
                            ? "text-(--cyber-gold)"
                            : "text-(--electric-blue)"
                        }
                      >
                        //
                      </span>
                      {cat.name}
                    </h3>
                    <p className="font-body text-sm md:text-base text-(--text-muted) max-w-3xl">
                      {cat.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
