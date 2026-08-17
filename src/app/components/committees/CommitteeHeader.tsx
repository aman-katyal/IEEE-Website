import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "boneyard-js/react";
import type { Committee } from "../../../data/committees/types";

interface CommitteeHeaderProps {
  committee: Committee | null | undefined;
  loading: boolean;
  isLight: boolean;
}

export function CommitteeHeader({ committee, loading, isLight }: CommitteeHeaderProps) {
  return (
    <Skeleton
      name="committee-banner"
      loading={loading}
      color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
    >
      <section
        style={{
          position: "relative",
          minHeight: "380px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Background Banner Image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: committee?.image ? `url('${committee.image}')` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: isLight
              ? "brightness(0.9) saturate(1.1)"
              : "brightness(0.35) saturate(0.7)",
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isLight
              ? "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 30%, rgba(248,250,252,0.85) 80%, var(--boiler-black) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 80%, var(--boiler-black) 100%)",
          }}
        />

        {/* IEEE PCB Grid Texture */}
        <div
          className="ieee-grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            opacity: isLight ? 0.4 : 0.6,
          }}
        />

        {/* Hero Title & Breadcrumbs */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "120px clamp(16px, 4vw, 32px) 32px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {/* Breadcrumb Navigation */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                height: "28px",
              }}
            >
              <Link
                to="/"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: isLight ? 1 : 0.75,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--electric-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                <ArrowLeft size={14} /> Home
              </Link>
              <span style={{ color: "var(--text-muted)" }}>/</span>
              <Link
                to="/committees"
                style={{
                  color: "var(--electric-blue)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Committees
              </Link>
            </div>

            {/* Non-Active Status Badge (Archived / Inactive only) */}
            {committee?.status && committee.status.toLowerCase() !== "active" && (
              <div
                className="status-badge"
                style={{
                  background: committee.statusBg || "rgba(0, 98, 155, 0.1)",
                  color: committee.statusColor || "var(--electric-blue)",
                  backdropFilter: "blur(12px)",
                  margin: 0,
                  display: "inline-flex",
                  padding: "0 14px",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  borderRadius: "100px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  alignItems: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  height: "28px",
                  lineHeight: "28px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                  }}
                >
                  <span
                    className="animate-ping"
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      height: "8px",
                      width: "8px",
                      borderRadius: "50%",
                      background: "currentColor",
                      opacity: 0.75,
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      borderRadius: "50%",
                      height: "6px",
                      width: "6px",
                      background: "currentColor",
                    }}
                  />
                </div>
                {committee.status}
              </div>
            )}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(36px, 5.5vw, 68px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "12px",
              maxWidth: "900px",
            }}
          >
            {committee?.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--cyber-gold)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: isLight ? 1 : 0.9,
              fontWeight: isLight ? 600 : 500,
            }}
          >
            {committee?.tagline}
            {committee?.foundedYear ? ` • Est. ${committee.foundedYear}` : ""}
          </p>
        </div>
      </section>
    </Skeleton>
  );
}
