import { Skeleton } from "boneyard-js/react";
import { Breadcrumbs } from "../shared/Breadcrumbs";
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
      <section className="relative min-h-[380px] flex items-end overflow-hidden">
        {/* Background Banner Image */}
        <div
          className={`absolute inset-0 bg-cover bg-[center_40%] ${
            isLight
              ? "brightness-90 saturate-110"
              : "brightness-35 saturate-70"
          }`}
          style={{
            backgroundImage: committee?.image ? `url('${committee.image}')` : "none",
          }}
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-gradient-to-b from-white/10 via-transparent via-30% to-slate-100/85 to-80%"
              : "bg-gradient-to-b from-black/20 via-transparent via-30% to-black/85 to-80%"
          }`}
          style={{
            backgroundColor: "transparent",
          }}
        />

        {/* IEEE PCB Grid Texture */}
        <div className={`ieee-grid-bg absolute inset-0 ${isLight ? "opacity-40" : "opacity-60"}`} />

        {/* Hero Title & Breadcrumbs */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 w-full">
          <div className="flex items-center justify-between mb-6 gap-6 flex-wrap">
            {/* Breadcrumb Navigation */}
            <Breadcrumbs
              items={[
                { label: "Committees", href: "/committees" },
                { label: committee?.name || "Committee" },
              ]}
            />

            <div className="flex items-center gap-3 flex-wrap">
              {/* Non-Active Status Badge */}
              {committee?.status && committee.status.toLowerCase() !== "active" && (
                <div
                  className="status-badge"
                  style={{
                    background: committee.statusBg || "rgba(255, 0, 0, 0.2)",
                    color: committee.statusColor || "#ff5555",
                  }}
                >
                  <span className="dot" />
                  {committee.status}
                </div>
              )}

              {/* Founded Year Tag */}
              {committee?.foundedYear && (
                <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--cyber-gold)] tracking-widest uppercase border border-[var(--cyber-gold)]/30 px-3 py-1 rounded bg-[rgba(235,211,169,0.05)]">
                  EST. {committee.foundedYear}
                </span>
              )}
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-headline)] text-3xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-3 leading-tight tracking-tight">
            {committee?.name || "Committee"}
          </h1>

          <p className="font-[family-name:var(--font-mono)] text-xs sm:text-sm text-[var(--cyber-gold)] tracking-widest uppercase mb-6 max-w-3xl opacity-90">
            {committee?.tagline}
          </p>
        </div>
      </section>
    </Skeleton>
  );
}
