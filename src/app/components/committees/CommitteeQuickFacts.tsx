import React from "react";
import { useNavigate } from "react-router";
import { Mail, ChevronRight, ExternalLink, AlertCircle } from "lucide-react";
import { Skeleton } from "boneyard-js/react";
import { getPlatformIcon } from "../icons/getPlatformIcon";
import type { Committee } from "../../../data/committees/types";

interface CommitteeQuickFactsProps {
  committee: Committee | null | undefined;
  loading: boolean;
  isLight: boolean;
}

export function CommitteeQuickFacts({ committee, loading, isLight }: CommitteeQuickFactsProps) {
  const navigate = useNavigate();

  if (!committee && !loading) return null;

  const renderJoinButton = () => {
    if (!committee) return null;
    const config = committee.joinConfig;

    if (!config || config.type === "default") {
      return (
        <button
          onClick={() => navigate("/join")}
          className="btn-primary"
          style={{
            width: "100%",
            textAlign: "center",
            padding: "12px 20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          Join This Committee <ChevronRight size={16} />
        </button>
      );
    }

    if (config.type === "link") {
      const url = config.url || "";
      const isExternal = url.startsWith("http");
      const isDiscord = url.toLowerCase().includes("discord");

      return (
        <button
          onClick={() => {
            if (isExternal) {
              try {
                const urlObj = new URL(url);
                if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
                  window.open(urlObj.href, "_blank", "noopener,noreferrer");
                }
              } catch (e) {
                // Invalid URL
              }
            } else {
              navigate(url || "/join");
            }
          }}
          className="btn-primary"
          style={{
            width: "100%",
            textAlign: "center",
            padding: "12px 20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: isDiscord ? "#5865F2" : "var(--electric-blue)",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {getPlatformIcon("", url, 16)}
          <span>{config.buttonText || "Join Us"}</span>
          {isExternal ? (
            <ExternalLink size={14} style={{ opacity: 0.8 }} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      );
    }

    if (config.type === "message") {
      return (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(235, 211, 169, 0.05)",
            border: "1px solid var(--glass-border)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <AlertCircle
            size={16}
            style={{
              color: "var(--cyber-gold)",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12.5px",
              color: "var(--text-secondary)",
              lineHeight: 1.45,
            }}
          >
            {config.message ||
              "We are not currently accepting new members. Please check back later!"}
          </div>
        </div>
      );
    }

    return null;
  };

  const hasMetrics = committee?.metrics && committee.metrics.length > 0;
  const hasChair = !!committee?.chair;
  const hasSocials = committee?.socialLinks && committee.socialLinks.length > 0;

  return (
    <Skeleton
      name="committee-quick-facts"
      loading={loading}
      color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
    >
      <div
        className="glass-card"
        style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          alignItems: "center",
          marginBottom: "48px",
          background: isLight ? "rgba(255,255,255,0.8)" : "rgba(10, 15, 25, 0.65)",
          borderColor: isLight ? "rgba(0, 90, 135, 0.15)" : "rgba(0, 98, 155, 0.2)",
        }}
      >
        {/* Metric Counter Columns */}
        {hasMetrics && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              gap: "16px",
              paddingRight: "16px",
              borderRight: "1px solid var(--glass-border)",
            }}
          >
            {committee.metrics!.map((m) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--electric-blue)",
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Leadership / Contact Info */}
        {hasChair && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingRight: "16px",
              borderRight: "1px solid var(--glass-border)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              // Contact Leadership
            </div>
            <div
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "17px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {committee?.chair}
            </div>
            {committee?.email && (
              <a
                href={`mailto:${committee.email}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--electric-blue)",
                  textDecoration: "none",
                  marginTop: "2px",
                }}
              >
                <Mail size={13} style={{ flexShrink: 0 }} />
                {committee.email}
              </a>
            )}
          </div>
        )}

        {/* Action Button & Social Tags */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          {renderJoinButton()}

          {hasSocials && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              {committee.socialLinks!.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-tag"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  {getPlatformIcon(social.platform, social.url, 12)}
                  <span style={{ textTransform: "capitalize" }}>
                    {social.platform || "Link"}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Skeleton>
  );
}
