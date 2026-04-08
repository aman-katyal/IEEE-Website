import { FileText, Shield, Download, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useSiteSettings } from "../../hooks/useSanityData";

export function ConstitutionPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--boiler-black)", color: "var(--text-primary)" }}>Loading...</div>;
  }

  const coreDocs = settings?.branchConstitution ? [settings.branchConstitution] : [
    { name: "Purdue IEEE Constitution", description: "The foundational governing document of the Purdue IEEE Student Branch.", pdfUrl: "/documents/constitution/Constitution_of_IEEE.pdf" },
  ];

  const committeeBylaws = settings?.committeeBylaws || [
    { name: "CSociety Bylaws", pdfUrl: "/documents/constitution/csociety_bylaws.pdf" },
    { name: "EMBS Bylaws", pdfUrl: "/documents/constitution/embs_bylaws.pdf" },
    { name: "MTT-S Bylaws", pdfUrl: "/documents/constitution/mtt-s_bylaws.pdf" },
    { name: "SMC Bylaws", pdfUrl: "/documents/constitution/IEEE_ByLaws_SMC_at_Purdue.pdf" },
    { name: "Racing Bylaws", pdfUrl: "/documents/constitution/racing_bylaws.pdf" },
    { name: "ROV Bylaws", pdfUrl: "/documents/constitution/rov_bylaws.pdf" },
    { name: "Software Saturdays Bylaws", pdfUrl: "/documents/constitution/swsat_bylaws.pdf" },
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
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <Shield size={24} style={{ color: "var(--electric-blue)" }} />
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "24px", fontWeight: 600, color: "var(--text-primary)" }}>Branch Constitution</h3>
            </div>
            {coreDocs.map((doc) => (
              <div key={doc.name} className="glass-card" style={{ padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
                <div>
                  <h4 style={{ fontFamily: "var(--font-headline)", fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{doc.name}</h4>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{doc.description}</p>
                </div>
                <a href={doc.pdfUrl} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
                  <Download size={16} />
                  View PDF
                </a>
              </div>
            ))}
          </div>

          {/* Committee Bylaws */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <FileText size={24} style={{ color: "var(--cyber-gold)" }} />
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "24px", fontWeight: 600, color: "var(--text-primary)" }}>Technical Committee Bylaws</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {committeeBylaws.map((doc) => (
                <a 
                  key={doc.name} 
                  href={doc.pdfUrl} 
                  className="glass-card" 
                  style={{ 
                    padding: "20px 24px", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    textDecoration: "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)", fontWeight: 500 }}>{doc.name}</span>
                  <ExternalLink size={14} style={{ color: "var(--electric-blue)" }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
