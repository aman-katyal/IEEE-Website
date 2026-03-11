import { useParams, Link } from "react-router";
import { ArrowLeft, Mail, Users, Trophy, Cpu, ChevronRight, Calendar, Globe, MessageCircle } from "lucide-react";
import { getCommitteeById, committees } from "../../data/committees";

export function CommitteePage() {
  const { id } = useParams<{ id: string }>();
  const committee = getCommitteeById(id ?? "");

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
        }}
      >
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "48px",
            fontWeight: 700,
            color: "#F8F9FA",
            marginBottom: "16px",
          }}
        >
          Committee Not Found
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "16px",
            color: "rgba(248,249,250,0.5)",
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
            color: "#00629B",
            textDecoration: "none",
            fontFamily: "'IBM Plex Sans', sans-serif",
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
            filter: "brightness(0.35) saturate(0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 80%, #000000 100%)",
          }}
        />
        <div className="ieee-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />

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
              color: "rgba(248,249,250,0.5)",
              textDecoration: "none",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "24px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#F8F9FA";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,249,250,0.5)";
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
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: "#F8F9FA",
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
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.75rem",
              color: "rgba(235,211,169,0.6)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {committee.tagline}
          </p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────── */}
      <section
        style={{
          background: "#000000",
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
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#F8F9FA",
                    marginBottom: "16px",
                  }}
                >
                  About This Committee
                </h2>
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "15px",
                    color: "rgba(248,249,250,0.6)",
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
                  <span key={tag} className="tech-tag">
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
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#F8F9FA",
                          marginBottom: "8px",
                        }}
                      >
                        {p.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          fontSize: "13.5px",
                          color: "rgba(248,249,250,0.5)",
                          lineHeight: 1.65,
                        }}
                      >
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Gallery (optional) ─────────────────────────── */}
              {committee.gallery && committee.gallery.length > 0 && (
                <div style={{ marginBottom: "48px" }}>
                  <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
                    // Gallery
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {committee.gallery.map((img, i) => (
                      <div key={i} style={{ position: "relative", borderRadius: "4px", overflow: "hidden" }}>
                        <img
                          src={img.src}
                          alt={img.caption}
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            display: "block",
                            filter: "brightness(0.8)",
                          }}
                        />
                        {img.caption && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                              padding: "16px 12px 8px",
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: "0.6rem",
                              color: "rgba(248,249,250,0.6)",
                              letterSpacing: "0.06em",
                            }}
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
                          <MessageCircle size={14} style={{ color: "#00629B", flexShrink: 0, marginTop: "2px" }} />
                          <h4
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#F8F9FA",
                              lineHeight: 1.4,
                            }}
                          >
                            {faq.question}
                          </h4>
                        </div>
                        <p
                          style={{
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: "13px",
                            color: "rgba(248,249,250,0.45)",
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
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: "14px",
                        color: "rgba(248,249,250,0.55)",
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
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.18em",
                    color: "#00629B",
                    textTransform: "uppercase",
                    marginBottom: "20px",
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
                    borderTop: "1px solid rgba(235,211,169,0.08)",
                    borderBottom: "1px solid rgba(235,211,169,0.08)",
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
                        borderRight: i < 2 ? "1px solid rgba(235,211,169,0.08)" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#00629B",
                          lineHeight: 1,
                        }}
                      >
                        {m.value}
                      </span>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.58rem",
                          color: "rgba(248,249,250,0.3)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
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
                        background: "rgba(0,98,155,0.08)",
                        borderRadius: "4px",
                        border: "1px solid rgba(0,98,155,0.15)",
                      }}
                    >
                      <Calendar size={14} style={{ color: "#00629B", flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          fontSize: "12.5px",
                          color: "rgba(248,249,250,0.6)",
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
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      color: "rgba(248,249,250,0.3)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Committee Chair
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#F8F9FA",
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
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.7rem",
                      color: "#00629B",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#EBD3A9";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#00629B";
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
                      background: "rgba(0,200,83,0.06)",
                      borderRadius: "4px",
                      border: "1px solid rgba(0,200,83,0.12)",
                      marginBottom: "20px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: "12px",
                        color: "rgba(248,249,250,0.5)",
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
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        color: "rgba(248,249,250,0.3)",
                        textTransform: "uppercase",
                        marginBottom: "10px",
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
                            border: "1px solid rgba(235,211,169,0.12)",
                            borderRadius: "4px",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: "0.6rem",
                            color: "rgba(248,249,250,0.4)",
                            textDecoration: "none",
                            transition: "color 0.2s ease, border-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.color = "#00629B";
                            el.style.borderColor = "rgba(0,98,155,0.5)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.color = "rgba(248,249,250,0.4)";
                            el.style.borderColor = "rgba(235,211,169,0.12)";
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
                <Link
                  to="/#join"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "12px",
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  Join This Committee
                </Link>
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
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#F8F9FA",
                          marginBottom: "4px",
                        }}
                      >
                        {c.shortName}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.62rem",
                          color: "rgba(235,211,169,0.5)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {c.tagline}
                      </p>
                    </div>
                    <ChevronRight size={16} style={{ color: "rgba(248,249,250,0.3)" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
