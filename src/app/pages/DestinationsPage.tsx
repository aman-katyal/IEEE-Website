import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Building2,
  ExternalLink,
  Search,
  ArrowRight,
  Sparkles,
  Briefcase,
  Compass,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useHomePage } from "../../hooks/useSanityData";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { MagneticWrapper } from "../components/ui/MagneticWrapper";
import type { AlumniCompany } from "../../data/sanity-types";

export function DestinationsPage() {
  const { data, loading } = useHomePage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const companies: AlumniCompany[] = data?.alumniCompanies || [];
  const highlightText = data?.alumniHighlightText || "";

  // Derive categories from existing companies
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("all");
    companies.forEach((c) => {
      if (c.roleOrField) {
        const field = c.roleOrField.toLowerCase();
        if (field.includes("aerospace") || field.includes("defense") || field.includes("space") || field.includes("aviation") || field.includes("naval")) {
          cats.add("Aerospace & Defense");
        } else if (field.includes("semiconductor") || field.includes("hardware") || field.includes("silicon") || field.includes("micro") || field.includes("pcb") || field.includes("rf")) {
          cats.add("Semiconductors & Hardware");
        } else if (field.includes("software") || field.includes("cloud") || field.includes("tech") || field.includes("ai") || field.includes("fintech")) {
          cats.add("Software & Cloud");
        } else if (field.includes("robotics") || field.includes("automotive") || field.includes("manufacturing") || field.includes("tools") || field.includes("subsea")) {
          cats.add("Robotics & Automotive");
        } else if (field.includes("power") || field.includes("energy") || field.includes("utilities") || field.includes("grid")) {
          cats.add("Energy & Power");
        }
      }
    });
    return Array.from(cats);
  }, [companies]);

  // Filtered companies based on search and category
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.roleOrField && c.roleOrField.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.domain && c.domain.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedCategory === "all") return true;

      const field = (c.roleOrField || "").toLowerCase();
      if (selectedCategory === "Aerospace & Defense") {
        return field.includes("aerospace") || field.includes("defense") || field.includes("space") || field.includes("aviation") || field.includes("naval");
      }
      if (selectedCategory === "Semiconductors & Hardware") {
        return field.includes("semiconductor") || field.includes("hardware") || field.includes("silicon") || field.includes("micro") || field.includes("pcb") || field.includes("rf");
      }
      if (selectedCategory === "Software & Cloud") {
        return field.includes("software") || field.includes("cloud") || field.includes("tech") || field.includes("ai") || field.includes("fintech");
      }
      if (selectedCategory === "Robotics & Automotive") {
        return field.includes("robotics") || field.includes("automotive") || field.includes("ev") || field.includes("manufacturing") || field.includes("tools") || field.includes("subsea");
      }
      if (selectedCategory === "Energy & Power") {
        return field.includes("power") || field.includes("energy") || field.includes("utilities") || field.includes("grid");
      }

      return true;
    });
  }, [companies, searchQuery, selectedCategory]);

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
          padding: "80px 0 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="ieee-grid-bg"
          style={{ position: "absolute", inset: 0, opacity: isLight ? 0.35 : 0.2 }}
        />

        {/* Ambient Glows */}
        <div
          className="electric-glow-orb"
          style={{
            width: "600px",
            height: "300px",
            top: "0px",
            right: "-100px",
            background: "radial-gradient(ellipse, rgba(0, 98, 155, 0.18) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Destinations" },
              ]}
            />
          </div>

          <div style={{ maxWidth: "800px" }}>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-sky-400" />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  color: "var(--electric-blue)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                // ALUMNI & INTERNSHIP DESTINATIONS
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(32px, 5vw, 54px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Where Our Engineers <span style={{ color: "var(--electric-blue)" }}>Go</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(16px, 2vw, 19px)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              Purdue IEEE engineers build practical, competition-tested expertise that propels them to leading aerospace programs, cutting-edge semiconductor fabs, defense laboratories, and global tech pioneers.
            </p>

            {highlightText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono mb-4">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{highlightText}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid and Filter Section */}
      <section
        style={{
          padding: "16px 0 80px",
          position: "relative",
          zIndex: 3,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
          }}
        >
          {/* Search & Filter Bar */}
          <div className="glass-card p-4 sm:p-5 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search companies, domains, or fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-sans"
                aria-label="Search destinations by name or industry"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const label = cat === "all" ? "All Sectors" : cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                        : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700/50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card p-6 h-48 animate-pulse flex flex-col justify-between"
                  style={{ background: "rgba(10, 10, 12, 0.4)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-8 bg-slate-800 rounded w-full mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* Companies Grid */}
          {!loading && filteredCompanies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCompanies.map((company, index) => {
                const careersUrl = company.url || (company.domain ? `https://${company.domain}` : undefined);
                const faviconUrl = company.domain
                  ? `https://www.google.com/s2/favicons?domain=${company.domain}&sz=64`
                  : null;

                return (
                  <MagneticWrapper key={company._key || `${company.name}-${index}`} strength={0.03}>
                    <div
                      className="glass-card group hover:border-sky-500/50 transition-all duration-300 p-6 flex flex-col justify-between h-full relative overflow-hidden"
                      style={{
                        background: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(10, 15, 25, 0.55)",
                        border: "1px solid var(--glass-border)",
                      }}
                      data-testid="destination-card"
                    >
                      {/* Top ambient glow accent */}
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/60 to-sky-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div>
                        {/* Company Logo & Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center p-2 shrink-0 group-hover:border-sky-500/30 transition-colors shadow-sm">
                              {faviconUrl ? (
                                <img
                                  src={faviconUrl}
                                  alt={`${company.name} logo`}
                                  className="w-6 h-6 object-contain rounded-sm"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-sky-400" />
                              )}
                            </div>

                            <div>
                              <h2 className="font-bold text-[17px] text-[var(--text-primary)] leading-tight group-hover:text-sky-300 transition-colors">
                                {company.name}
                              </h2>
                              {company.domain && (
                                <span className="text-xs font-mono text-slate-400 block mt-0.5">
                                  {company.domain}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Industry / Role Tag */}
                        {company.roleOrField && (
                          <div className="my-3">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium">
                              {company.roleOrField}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {careersUrl ? (
                          <a
                            href={careersUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold no-underline transition-colors"
                            aria-label={`Visit ${company.name} careers portal (opens in a new tab)`}
                          >
                            <span>Explore Careers</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">Industry Partner</span>
                        )}

                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Purdue IEEE
                        </span>
                      </div>
                    </div>
                  </MagneticWrapper>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCompanies.length === 0 && (
            <div className="glass-card p-12 text-center max-w-xl mx-auto my-8">
              <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-200 mb-2">
                No destination found
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                No organizations matched your search "{searchQuery}". Try searching for another keyword or clear the active filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn-primary py-2 px-5 text-xs font-semibold cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Career Launchpad CTA */}
      <section
        style={{
          padding: "80px 0 96px",
          background: "rgba(0, 98, 155, 0.04)",
          borderTop: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 32px)",
            textAlign: "center",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>ACCELERATE YOUR ENGINEERING CAREER</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Ready to Build What Employers Hire For?
          </h2>

          <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
            Our 9 technical committees give undergraduates direct, hands-on experience designing aerospace submersibles, autonomous EV racecars, RF communications hardware, and distributed software systems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/committees"
              className="btn-primary py-3.5 px-6 inline-flex items-center gap-2 text-sm font-semibold no-underline"
            >
              Explore 9 Committees
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/join"
              className="px-6 py-3.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm font-semibold no-underline transition-all"
            >
              How to Join IEEE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
