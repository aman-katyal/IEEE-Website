import { useState } from "react";
import { Compass, Wrench, Cpu, Award, ChevronRight } from "lucide-react";

export interface RoadmapStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: typeof Compass;
  skills: string[];
  description: string;
}

const DEFAULT_STAGES: RoadmapStage[] = [
  {
    id: "discovery",
    stepNumber: 1,
    title: "Callouts & Discovery",
    subtitle: "Weeks 1–3",
    icon: Compass,
    skills: ["Branch Overview", "Committee Demos", "Discord Onboarding"],
    description:
      "Attend the general branch callout, explore the 8 technical committees, and meet project leads.",
  },
  {
    id: "foundations",
    stepNumber: 2,
    title: "Foundations & Workshops",
    subtitle: "Weeks 4–7",
    icon: Wrench,
    skills: ["Soldering Safety", "Git & GitHub", "Microcontroller Basics"],
    description:
      "Participate in beginner-friendly hands-on workshops run by Computer Society and Code Cafe.",
  },
  {
    id: "hands-on",
    stepNumber: 3,
    title: "Committee Project Team",
    subtitle: "Weeks 8–14",
    icon: Cpu,
    skills: ["Circuit Design", "Firmware / Embedded C", "Mechanical CAD"],
    description:
      "Join an active subsystem team within ROV, Racing, Aerial Robotics, EMBS, or MTT-S.",
  },
  {
    id: "leadership",
    stepNumber: 4,
    title: "Leadership & Beyond",
    subtitle: "Spring / Year 2+",
    icon: Award,
    skills: ["Project Management", "Technical Chair", "Executive Board"],
    description:
      "Step into team captain, committee chair, or executive officer roles to lead the branch.",
  },
];

interface LearningRoadmapProps {
  stages?: RoadmapStage[];
}

export function LearningRoadmap({ stages = DEFAULT_STAGES }: LearningRoadmapProps) {
  const [activeStageId, setActiveStageId] = useState<string>(stages[0]?.id || "");

  const activeStage = stages.find((s) => s.id === activeStageId) || stages[0];

  return (
    <div className="w-full space-y-8" aria-label="Student Learning Roadmap">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          // Student Journey
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
          Freshman to Leader Roadmap
        </h2>
        <p className="text-sm text-neutral-400">
          Your path from attending your first callout meeting to building competition-ready hardware.
        </p>
      </div>

      {/* Stage Step Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isActive
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                  : "bg-neutral-900/60 border-white/10 hover:border-white/20 hover:bg-neutral-850"
              }`}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isActive ? "bg-primary text-black" : "bg-white/10 text-neutral-400"
                  }`}
                >
                  Step 0{stage.stepNumber}
                </span>
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary" : "text-neutral-400"}`}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h3 className={`text-sm font-bold ${isActive ? "text-white" : "text-neutral-300"}`}>
                  {stage.title}
                </h3>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">{stage.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail Card */}
      {activeStage && (
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-white/15 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono text-primary font-semibold">
                Step 0{activeStage.stepNumber} • {activeStage.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeStage.title}
              </h3>
            </div>
          </div>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            {activeStage.description}
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Key Skills Acquired:
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeStage.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-neutral-200"
                >
                  <ChevronRight className="w-3 h-3 text-primary" aria-hidden="true" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
