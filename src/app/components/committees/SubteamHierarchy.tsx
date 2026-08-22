import { useState } from "react";
import { ChevronDown, Users, Clock, ShieldCheck } from "lucide-react";

export interface Subteam {
  id: string;
  name: string;
  leadName: string;
  leadRole?: string;
  description: string;
  meetingTime?: string;
  focusAreas: string[];
}

interface SubteamHierarchyProps {
  subteams: Subteam[];
}

export function SubteamHierarchy({ subteams }: SubteamHierarchyProps) {
  const [expandedId, setExpandedId] = useState<string | null>(subteams[0]?.id || null);

  if (!subteams || subteams.length === 0) return null;

  return (
    <div className="w-full space-y-4" aria-label="Committee Subteam Hierarchy">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-primary" aria-hidden="true" />
        <h3 className="text-xl font-bold font-mono text-white">Subteams & Technical Focus</h3>
      </div>

      <div className="space-y-3">
        {subteams.map((subteam) => {
          const isExpanded = expandedId === subteam.id;
          return (
            <div
              key={subteam.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? "bg-neutral-900/80 border-primary/40 shadow-md"
                  : "bg-neutral-900/40 border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : subteam.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{subteam.name}</span>
                    <span className="text-xs font-mono font-normal text-neutral-400">
                      // Lead: {subteam.leadName}
                    </span>
                  </h4>
                  {subteam.meetingTime && (
                    <p className="text-xs font-mono text-neutral-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{subteam.meetingTime}</span>
                    </p>
                  )}
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180 text-primary" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/5 space-y-4 text-sm">
                  <p className="text-neutral-300 leading-relaxed">{subteam.description}</p>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                      <span>Focus Areas & Tech:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {subteam.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-neutral-300"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
