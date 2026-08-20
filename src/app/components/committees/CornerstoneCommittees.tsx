import { Mail, Users, Layout, Loader2 } from "lucide-react";
import { useCornerstoneCommittees } from "../../../hooks/useSanityData";
import ReactMarkdown from "react-markdown";

export function CornerstoneCommittees({ filterId }: { filterId?: "involvement" | "operations" }) {
  const { committees: cornerstoneCommittees, loading, error } = useCornerstoneCommittees();

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-[var(--boiler-black)]">
        <Loader2 className="animate-spin text-[var(--electric-blue)]" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-[var(--text-secondary)]">
        Error loading cornerstone committees: {error.message}
      </div>
    );
  }

  const displayedSections = filterId 
    ? cornerstoneCommittees.filter((section) => section.id.toLowerCase().includes(filterId))
    : cornerstoneCommittees;

  return (
    <section
      id="cornerstone"
      className="bg-[var(--boiler-black)] pt-4 pb-24 relative overflow-hidden"
    >
      {/* Background Grid */}
      <div className="ieee-grid-bg absolute inset-0 opacity-25" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          {displayedSections.map((section) => (
            <div key={section.id}>
              <div className="mb-8 max-w-3xl">
                <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-3">
                  {section.id === "operations" ? (
                    <Layout size={24} className="text-[var(--electric-blue)]" />
                  ) : (
                    <Users size={24} className="text-[var(--cyber-gold)]" />
                  )}
                  {section.name}
                </h3>
                <div className="font-[family-name:var(--font-body)] text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  <ReactMarkdown>{section.description}</ReactMarkdown>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.leads.map((lead, index) => (
                  <div
                    key={lead.role}
                    className="glass-card animate-fade-in-up p-8 flex flex-col h-full bg-white/[0.03] border-[var(--glass-border)]"
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    <div className="mb-5">
                      <h4 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[var(--text-primary)] mb-1">
                        {lead.role}
                      </h4>
                      <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--cyber-gold)] tracking-wide mb-3 font-semibold">
                        Chair: {lead.name}
                      </p>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="font-[family-name:var(--font-mono)] text-xs text-[var(--electric-blue)] flex items-center gap-1.5 hover:underline"
                        >
                          <Mail size={12} />
                          {lead.email}
                        </a>
                      )}
                    </div>

                    {lead.description && (
                      <div className="mt-auto pt-4 border-t border-[var(--glass-border)] font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)] leading-relaxed">
                        <ReactMarkdown>{lead.description}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
