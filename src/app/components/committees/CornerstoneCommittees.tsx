import { Mail, Users, Layout, Loader2 } from "lucide-react";
import { useCornerstoneCommittees } from "../../../hooks/useSanityData";
import ReactMarkdown from "react-markdown";

export function CornerstoneCommittees() {
  const { committees: cornerstoneCommittees, loading, error } = useCornerstoneCommittees();

  if (loading) {
    return (
      <div style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--boiler-black)" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--electric-blue)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-secondary)" }}>
        Error loading cornerstone committees: {error.message}
      </div>
    );
  }
  return (
    <section
      id="cornerstone"
      style={{
        background: "var(--boiler-black)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.25 }}
      />

      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, var(--electric-blue) 30%, var(--cyber-gold) 50%, var(--electric-blue) 70%, transparent 100%)",
          opacity: 0.4
        }}
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
        <div style={{ marginBottom: "72px" }}>
          <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
            // Organization & Operations
          </p>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              marginBottom: "24px",
            }}
          >
            Behind the <span style={{ color: "var(--electric-blue)" }}>Scenes</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {cornerstoneCommittees.map((section) => (
            <div key={section.id}>
              <div style={{ marginBottom: "32px", maxWidth: "800px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {section.id === "operations" ? <Layout size={24} style={{ color: "var(--electric-blue)" }} /> : <Users size={24} style={{ color: "var(--cyber-gold)" }} />}
                  {section.name}
                </h3>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "17px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <ReactMarkdown>{section.description}</ReactMarkdown>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "24px",
                }}
              >
                {section.leads.map((lead, index) => (
                  <div
                    key={lead.role}
                    className="glass-card animate-fade-in-up opacity-0-init"
                    style={{
                      padding: "32px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      background: "rgba(128, 128, 128, 0.05)",
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          background: "rgba(0, 98, 155, 0.1)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "4px",
                          color: "var(--electric-blue)",
                          fontSize: "12px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "16px",
                        }}
                      >
                        {lead.role}
                      </div>
                      <h4
                        style={{
                          fontFamily: "var(--font-headline)",
                          fontSize: "22px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: "8px",
                        }}
                      >
                        {lead.name}
                      </h4>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        marginBottom: "24px",
                        flexGrow: 1,
                      }}
                    >
                      <ReactMarkdown>{lead.description || ""}</ReactMarkdown>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "20px" }}>
                      <Mail size={16} style={{ color: "var(--electric-blue)", flexShrink: 0 }} />
                      <a
                        href={`mailto:${lead.email}`}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--electric-blue)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                      >
                        {lead.email}
                      </a>
                    </div>
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
