import { useNavigate } from "react-router";
import { Mail, ChevronRight, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { Skeleton } from "boneyard-js/react";
import { getPlatformIcon } from "../icons/getPlatformIcon";
import type { Committee } from "../../../data/committees/types";

interface CommitteeQuickFactsProps {
  committee: Committee | null | undefined;
  loading: boolean;
  isLight: boolean;
}

export function CommitteeQuickFacts({
  committee,
  loading,
  isLight,
}: CommitteeQuickFactsProps) {
  const navigate = useNavigate();

  if (!committee && !loading) return null;

  const renderJoinButton = () => {
    if (!committee) return null;
    const config = committee.joinConfig;

    if (!config || config.type === "default") {
      return (
        <button
          onClick={() => navigate("/join")}
          className="btn-primary w-full text-center py-3 px-5 inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-semibold cursor-pointer"
        >
          Join This Committee <ChevronRight size={16} aria-hidden="true" />
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
                if (
                  urlObj.protocol === "http:" ||
                  urlObj.protocol === "https:"
                ) {
                  window.open(urlObj.href, "_blank", "noopener,noreferrer");
                }
              } catch (e) {
                // Invalid URL
              }
            } else {
              navigate(url || "/join");
            }
          }}
          className={`btn-primary w-full text-center py-3 px-5 inline-flex items-center justify-center gap-2 font-[family-name:var(--font-body)] text-sm font-semibold cursor-pointer ${
            isDiscord
              ? "bg-[#5865F2] hover:bg-[#4752C4] border-transparent text-white"
              : ""
          }`}
        >
          {config.buttonText || "Join Committee"}
          {isExternal ? (
            <ExternalLink size={16} aria-hidden="true" />
          ) : (
            <ChevronRight size={16} aria-hidden="true" />
          )}
        </button>
      );
    }

    if (config.type === "message") {
      return (
        <div className="p-3 bg-[rgba(235,211,169,0.05)] border border-[rgba(235,211,169,0.2)] rounded text-xs text-[var(--cyber-gold)] flex items-start gap-2 text-left font-[family-name:var(--font-mono)]">
          <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{config.message || "Contact committee chair for info."}</span>
        </div>
      );
    }

    return null;
  };

  const hasMetrics = committee?.metrics && committee.metrics.length > 0;
  const hasSocials = committee?.socialLinks && committee.socialLinks.length > 0;
  const hasChair = !!committee?.chair;

  return (
    <Skeleton
      name="committee-quick-facts"
      loading={loading}
      color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
    >
      <div className="glass-card p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-12 bg-[rgba(10,15,25,0.65)] border-[rgba(0,98,155,0.2)]">
        {/* Metrics Column */}
        {hasMetrics && (
          <div className="flex items-center justify-around gap-4 pr-0 md:pr-4 md:border-r border-[var(--glass-border)]">
            {committee.metrics!.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1">
                <span className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[var(--electric-blue)] leading-none">
                  {m.value}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[0.62rem] text-[var(--text-muted)] tracking-widest uppercase font-semibold">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Leadership / Contact & Meeting Info */}
        {hasChair && (
          <div className="flex flex-col gap-1 pr-0 md:pr-4 md:border-r border-[var(--glass-border)] text-center md:text-left">
            <div className="font-[family-name:var(--font-mono)] text-[0.6rem] tracking-widest text-[var(--text-muted)] uppercase font-semibold">
              // Contact Leadership
            </div>
            <div className="font-[family-name:var(--font-headline)] text-lg font-semibold text-[var(--text-primary)]">
              {committee?.chair}
            </div>
            {committee?.email && (
              <a
                href={`mailto:${committee.email}`}
                className="inline-flex items-center justify-center md:justify-start gap-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--electric-blue)] no-underline mt-0.5 hover:underline"
              >
                <Mail size={13} className="shrink-0" aria-hidden="true" />
                {committee.email}
              </a>
            )}
            {committee?.meetingSchedule && (
              <div className="inline-flex items-center justify-center md:justify-start gap-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--cyber-gold)] mt-1.5 opacity-90">
                <Clock size={11} className="shrink-0" aria-hidden="true" />
                <span>
                  {typeof committee.meetingSchedule === "string"
                    ? committee.meetingSchedule
                    : `${committee.meetingSchedule.dayOfWeek || ""} ${committee.meetingSchedule.time || ""} ${
                        committee.meetingSchedule.location ? `@ ${committee.meetingSchedule.location}` : ""
                      }`.trim()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Button & Social Tags */}
        <div className="flex flex-col gap-3 justify-center">
          {renderJoinButton()}

          {hasSocials && (
            <div className="flex gap-2 flex-wrap justify-center">
              {committee.socialLinks!.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-tag inline-flex items-center gap-1.5 py-1 px-2.5 rounded border border-[var(--glass-border)] text-[var(--text-secondary)] no-underline font-[family-name:var(--font-mono)] text-xs transition-all hover:text-[var(--electric-blue)] hover:border-[var(--electric-blue)]"
                >
                  {getPlatformIcon(social.platform, social.url, 12)}
                  <span className="capitalize">
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
