import { MessageCircle, CreditCard, Users, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export function JoinPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const duesBenefits = [
    "Access to industry networks and exclusive company info sessions",
    "Trip expense coverage for committee competitions and social events",
    "Free food at General Assemblies",
    "Recognition for contributed work with final projects",
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
        style={{ position: "absolute", inset: 0, opacity: 0.25 }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "72px", textAlign: "center" }}>
          <p className="section-eyebrow" style={{ marginBottom: "16px" }}>
            // Get Started
          </p>
          <h2
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--stellar-white)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "24px",
            }}
          >
            Joining Purdue IEEE is <span style={{ color: "var(--electric-blue)" }}>easier than ever!</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "rgba(248,249,250,0.6)",
              lineHeight: 1.6,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            To join, simply attend any committee meeting and pay dues.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {/* Quick Steps */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <Users size={24} style={{ color: "var(--electric-blue)" }} />
                <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "20px", fontWeight: 600, color: "var(--stellar-white)" }}>Attend Meetings</h3>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(248,249,250,0.5)", lineHeight: 1.6 }}>
                Check out our list of committees and find one that interests you. You're welcome to attend any meeting to see what we're about.
              </p>
            </div>
            <div className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <CreditCard size={24} style={{ color: "var(--cyber-gold)" }} />
                <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "20px", fontWeight: 600, color: "var(--stellar-white)" }}>Pay Dues</h3>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(248,249,250,0.5)", lineHeight: 1.6 }}>
                Official membership requires small annual dues, which fund our projects, competitions, and events.
              </p>
            </div>
          </div>

          {/* Connect Section */}
          <div className="glass-card" style={{ padding: "clamp(24px, 5vw, 48px)", background: "rgba(88, 101, 242, 0.05)", borderColor: "rgba(88, 101, 242, 0.2)" }}>
            <div style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "28px", fontWeight: 600, color: "var(--stellar-white)", marginBottom: "16px" }}>Connect with us</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(248,249,250,0.6)", lineHeight: 1.6, marginBottom: "24px" }}>
                  Join Purdue IEEE today and start connecting with fellow members on Discord. Stay engaged with all committee updates and event announcements.
                </p>
                <a
                  href="https://discord.gg/sPPQequ9ws"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    textDecoration: "none",
                    background: "#5865F2",
                    borderColor: "#5865F2"
                  }}
                >
                  <MessageCircle size={18} />
                  Join Discord
                </a>
              </div>
              <div style={{ width: "120px", height: "120px", background: "rgba(88, 101, 242, 0.1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center" }} className="hidden sm:flex">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="#5865F2" style={{ margin: "auto" }}>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                 </svg>
              </div>
            </div>
          </div>

          {/* Dues Section */}
          <div style={{ marginTop: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <div style={{ width: "40px", height: "1px", background: "var(--cyber-gold)" }} />
              <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "32px", fontWeight: 700, color: "var(--stellar-white)" }}>Dues</h3>
            </div>

            <div className="ieee-grid-2" style={{ gap: "32px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(248,249,250,0.6)", lineHeight: 1.7, marginBottom: "24px" }}>
                  Purdue IEEE Student Branch requires payment of dues for membership. To pay, follow the link below and <strong>search for "IEEE"</strong> in the catalog search box. Payment gives access to:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {duesBenefits.map((benefit) => (
                    <div key={benefit} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <CheckCircle2 size={18} style={{ color: "var(--electric-blue)", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--stellar-white)" }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: "clamp(24px, 5vw, 40px)", background: "rgba(0, 98, 155, 0.05)" }}>
                <h4 style={{ fontFamily: "var(--font-headline)", fontSize: "18px", fontWeight: 600, color: "var(--cyber-gold)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  2025-26 Options
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(235, 211, 169, 0.1)", paddingBottom: "16px" }}>
                    <div>
                      <span style={{ display: "block", color: "var(--stellar-white)", fontWeight: 600 }}>Standard Membership</span>
                      <span style={{ fontSize: "12px", color: "rgba(248,249,250,0.4)" }}>Local dues only</span>
                    </div>
                    <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--electric-blue)" }}>$10</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(235, 211, 169, 0.1)", paddingBottom: "16px" }}>
                    <div>
                      <span style={{ display: "block", color: "var(--stellar-white)", fontWeight: 600 }}>Membership + Shirt</span>
                      <span style={{ fontSize: "12px", color: "rgba(248,249,250,0.4)" }}>Support the branch & gear up</span>
                    </div>
                    <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--electric-blue)" }}>$15</span>
                  </div>
                </div>

                <a 
                  href="https://www.toocoolpurdue.com/TooCOOLPurdueWL/vECItemCatalogOrganizationItems/OrganizationItemsGallery.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold" 
                  style={{ width: "100%", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
                >
                  Pay via TooCool
                  <ExternalLink size={14} />
                </a>
                
                <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--electric-blue)", textAlign: "center", fontFamily: "var(--font-mono)" }}>
                  Search for "IEEE" in the search box on TooCool
                </p>
                
                <p style={{ marginTop: "24px", fontSize: "13px", color: "rgba(248,249,250,0.4)", fontStyle: "italic", lineHeight: 1.5 }}>
                  * If you have an active International IEEE Membership, you are exempt from local dues! Contact an officer to complete registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
