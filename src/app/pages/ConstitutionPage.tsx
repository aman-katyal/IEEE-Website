import { FileText, Shield, Download, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function ConstitutionPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreDocs = [
    { name: "Purdue IEEE Constitution", description: "The foundational governing document of the Purdue IEEE Student Branch.", link: "/documents/constitution/Constitution_of_IEEE.pdf" },
  ];

  const committeeBylaws = [
    { name: "CSociety Bylaws", link: "/documents/constitution/csociety_bylaws.pdf" },
    { name: "EMBS Bylaws", link: "/documents/constitution/embs_bylaws.pdf" },
    { name: "MTT-S Bylaws", link: "/documents/constitution/mtt-s_bylaws.pdf" },
    { name: "SMC Bylaws", link: "/documents/constitution/IEEE_ByLaws_SMC_at_Purdue.pdf" },
    { name: "Racing Bylaws", link: "/documents/constitution/racing_bylaws.pdf" },
    { name: "ROV Bylaws", link: "/documents/constitution/rov_bylaws.pdf" },
    { name: "Software Saturdays Bylaws", link: "/documents/constitution/swsat_bylaws.pdf" },
  ];

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
      {/* Background grid */}
      <div
        className="ieee-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: isLight ? 0.4 : 0.25 }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "72px" }}>
          <p className="section-eyebrow" style={{ marginBottom: "16px", opacity: isLight ? 1 : 0.9 }}>
            // Governance
          </p>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "24px",
            }}
          >
            Constitution and <span style={{ color: "var(--electric-blue)" }}>Bylaws</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            The official governing documents for Purdue IEEE and its technical committees.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {/* Core Constitution */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Shield size={24} className="text-[var(--electric-blue)]" />
              <h3 className="font-headline text-2xl font-semibold text-[var(--text-primary)]">Branch Constitution</h3>
            </div>
            {coreDocs.map((doc) => (
              <Card key={doc.name} className="glass-card border-none shadow-none">
                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-8">
                  <div>
                    <h4 className="font-headline text-xl font-semibold text-[var(--text-primary)] mb-2">{doc.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{doc.description}</p>
                  </div>
                  <Button asChild className="gap-2 px-6 shrink-0">
                    <a href={doc.link} target="_blank" rel="noopener noreferrer" className="no-underline">
                      <Download size={16} />
                      View PDF
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Committee Bylaws */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <FileText size={24} className="text-[var(--cyber-gold)]" />
              <h3 className="font-headline text-2xl font-semibold text-[var(--text-primary)]">Technical Committee Bylaws</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {committeeBylaws.map((doc) => (
                <Card key={doc.name} className="glass-card border-none shadow-none group cursor-pointer hover:bg-white/5 transition-colors">
                  <a 
                    href={doc.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center p-6 no-underline"
                  >
                    <span className="font-body text-[var(--text-primary)] font-medium">{doc.name}</span>
                    <ExternalLink size={14} className="text-[var(--electric-blue)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
