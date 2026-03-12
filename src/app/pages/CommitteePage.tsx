import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, Users, Trophy, Cpu, ChevronRight, Calendar, Globe, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { getCommitteeById, committees } from "../../data/committees";

export function CommitteePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const committee = getCommitteeById(id ?? "");
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!committee) {
    return (
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 32px 80px",
          textAlign: "center",
          background: "var(--boiler-black)"
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "48px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        >
          Committee Not Found
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            color: "var(--text-secondary)",
            marginBottom: "32px",
          }}
        >
          The committee you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--electric-blue)",
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </section>
    );
  }

  // Pick 3 related committees (excluding current)
  const related = committees.filter((c) => c.id !== committee.id).slice(0, 3);

  return (
    <>
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "55vh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${committee.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: isLight ? "brightness(0.9) saturate(1.1)" : "brightness(0.35) saturate(0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isLight 
              ? "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 30%, rgba(248,250,252,0.85) 80%, var(--boiler-black) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 80%, var(--boiler-black) 100%)",
          }}
        />
        <div className="ieee-grid-bg" style={{ position: "absolute", inset: 0, opacity: isLight ? 0.4 : 0.6 }} />

        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px 48px",
            width: "100%",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "24px",
              transition: "color 0.2s ease",
              opacity: isLight ? 1 : 0.8
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
            }}
          >
            <ArrowLeft size={14} />
            Home / Committees
          </Link>

          <div
            className="status-badge"
            style={{
              background: committee.statusBg,
              color: committee.statusColor,
              backdropFilter: "blur(6px)",
              marginBottom: "16px",
            }}
          >
            <span className="dot" />
            {committee.status}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
              maxWidth: "700px",
            }}
          >
            {committee.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--cyber-gold)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: isLight ? 1 : 0.8,
              fontWeight: isLight ? 600 : 400
            }}
          >
            {committee.tagline}
          </p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────── */}
      <section
        style={{
          background: "var(--boiler-black)",
          padding: "64px 0 96px",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          <div className="ieee-grid-sidebar">
            {/* Left — Content */}
            <div>
              {/* Description */}
              <div style={{ marginBottom: "48px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "16px",
                  }}
                >
                  About This Committee
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  {committee.longDescription}
                </p>
              </div>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "48px",
                }}
              >
                {committee.tags.map((tag) => (
                  <span key={tag} className="tech-tag" style={{ opacity: isLight ? 1 : 0.9 }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Projects */}
              <div style={{ marginBottom: "48px" }}>
                <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
                  // Active Projects
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {committee.projects.map((p) => (
                    <div
                      key={p.name}
                      className="glass-card"
                      style={{ padding: "24px" }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-headline)",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: "8px",
                        }}
                      >
                        {p.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "13.5px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.65,
                        }}
                      >
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Gallery ─────────────────────────── */}
              {committee.gallery && committee.gallery.length > 0 && (
                <div style={{ marginBottom: "64px" }}>
                  <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
                    // Committee Gallery
                  </p>
                  <div
                    style={{
                      columns: "2 300px",
                      columnGap: "16px",
                    }}
                  >
                    {committee.gallery.map((img, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          breakInside: "avoid",
                          marginBottom: "16px",
                          position: "relative", 
                          borderRadius: "8px", 
                          overflow: "hidden",
                          border: "1px solid var(--glass-border)",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        }}
                        className="gallery-item-container"
                        onMouseEnter={(e) => {
                          const imgEl = e.currentTarget.querySelector('img');
                          if (imgEl) imgEl.style.transform = "scale(1.05)";
                          e.currentTarget.style.borderColor = "var(--electric-blue)";
                          e.currentTarget.style.boxShadow = isLight ? "0 8px 20px rgba(0, 0, 0, 0.08)" : "0 8px 24px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          const imgEl = e.currentTarget.querySelector('img');
                          if (imgEl) imgEl.style.transform = "scale(1)";
                          e.currentTarget.style.borderColor = "var(--glass-border)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            transition: "transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)",
                            filter: isLight ? "brightness(1)" : "brightness(0.85)",
                          }}
                        />
                        {img.caption && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
                              padding: "24px 16px 12px",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.65rem",
                              color: "#FFFFFF",
                              letterSpacing: "0.06em",
                              opacity: 0,
                              transform: "translateY(10px)",
                              transition: "all 0.3s ease",
                            }}
                            className="caption-overlay"
                          >
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── FAQs (optional) ────────────────────────────── */}
              {committee.faqs && committee.faqs.length > 0 && (
                <div style={{ marginBottom: "48px" }}>
                  <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
                    // Frequently Asked Questions
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {committee.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="glass-card"
                        style={{ padding: "20px 24px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            marginBottom: "8px",
                          }}
                        >
                          <MessageCircle size={14} style={{ color: "var(--electric-blue)", flexShrink: 0, marginTop: "2px" }} />
                          <h4
                            style={{
                              fontFamily: "var(--font-headline)",
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              lineHeight: 1.4,
                            }}
                          >
                            {faq.question}
                          </h4>
                        </div>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.65,
                            paddingLeft: "24px",
                          }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Custom Sections (optional) ─────────────────── */}
              {committee.customSections?.map((section, i) => (
                <div key={i} style={{ marginBottom: "48px" }}>
                  <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
                    // {section.title}
                  </p>
                  <div
                    className="glass-card"
                    style={{ padding: "24px" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.75,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Sidebar */}
            <div>
              <div
                className="glass-card"
                style={{ padding: "32px", position: "sticky", top: "96px" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.18em",
                    color: "var(--electric-blue)",
                    textTransform: "uppercase",
                    marginBottom: "20px",
                    opacity: isLight ? 1 : 0.9
                  }}
                >
                  // Committee Details
                </div>

                {/* Metrics */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0",
                    borderTop: "1px solid var(--glass-border)",
                    borderBottom: "1px solid var(--glass-border)",
                    padding: "16px 0",
                    marginBottom: "24px",
                  }}
                >
                  {[
                    { label: "Members", value: `${committee.members}`, icon: Users },
                    { label: "Founded", value: committee.founded, icon: Cpu },
                    { label: "Awards", value: `${committee.awards}`, icon: Trophy },
                  ].map((m, i) => (
                    <div
                      key={m.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        borderRight: i < 2 ? "1px solid var(--glass-border)" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "var(--electric-blue)",
                          lineHeight: 1,
                        }}
                      >
                        {m.value}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                          color: "var(--text-muted)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          opacity: isLight ? 1 : 0.8
                        }}
                      >
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Meeting Schedule (optional) */}
                {committee.meetingSchedule && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                        padding: "12px",
                        background: isLight ? "rgba(0, 90, 135, 0.05)" : "rgba(0, 98, 155, 0.05)",
                        borderRadius: "4px",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <Calendar size={14} style={{ color: "var(--electric-blue)", flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12.5px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {committee.meetingSchedule}
                      </span>
                    </div>
                  </>
                )}

                {/* Chair */}
                <div className="gold-divider" style={{ marginBottom: "20px" }} />
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      opacity: isLight ? 1 : 0.8
                    }}
                  >
                    Committee Chair
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-headline)",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    {committee.chair}
                  </div>
                  <a
                    href={`mailto:${committee.email}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "var(--electric-blue)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--cyber-gold)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--electric-blue)";
                    }}
                  >
                    <Mail size={12} />
                    {committee.email}
                  </a>
                </div>

                {/* Recruitment Info (optional) */}
                {committee.recruitmentInfo && (
                  <div
                    style={{
                      padding: "12px",
                      background: isLight ? "rgba(22, 163, 74, 0.06)" : "rgba(0,200,83,0.06)",
                      borderRadius: "4px",
                      border: isLight ? "1px solid rgba(22, 163, 74, 0.12)" : "1px solid rgba(0,200,83,0.12)",
                      marginBottom: "20px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {committee.recruitmentInfo}
                    </p>
                  </div>
                )}

                {/* Social Links (optional) */}
                {committee.socialLinks && committee.socialLinks.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                        opacity: isLight ? 1 : 0.8
                      }}
                    >
                      Follow Us
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {committee.socialLinks.map((sl) => (
                        <a
                          key={sl.platform}
                          href={sl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 10px",
                            border: "1px solid var(--glass-border)",
                            borderRadius: "4px",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.6rem",
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.color = "var(--electric-blue)";
                            el.style.borderColor = "var(--electric-blue)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.color = "var(--text-secondary)";
                            el.style.borderColor = "var(--glass-border)";
                          }}
                        >
                          <Globe size={12} />
                          {sl.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => navigate("/join")}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    textDecoration: "none",
                  }}
                >
                  Join This Committee
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Related Committees ──────────────────────────── */}
          <div style={{ marginTop: "80px" }}>
            <p className="section-eyebrow" style={{ marginBottom: "24px" }}>
              // Explore More Committees
            </p>
            <div className="ieee-grid-3">
              {related.map((c) => (
                <Link
                  key={c.id}
                  to={`/committee/${c.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="glass-card"
                    style={{
                      padding: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-headline)",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {c.shortName}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.62rem",
                          color: "var(--cyber-gold)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          opacity: isLight ? 1 : 0.7,
                          fontWeight: isLight ? 600 : 400
                        }}
                      >
                        {c.tagline}
                      </p>
                    </div>
                    <ChevronRight size={16} style={{ color: isLight ? "var(--electric-blue)" : "var(--text-muted)" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        .gallery-item-container:hover .caption-overlay {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .gallery-item-container:hover img {
          filter: brightness(1) !important;
        }
      `}</style>
    </>
  );
}
