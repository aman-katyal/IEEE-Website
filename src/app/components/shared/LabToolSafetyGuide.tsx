import { useState, useMemo } from "react";
import { Shield, AlertTriangle, CheckCircle2, Search } from "lucide-react";

export interface LabToolItem {
  id: string;
  name: string;
  category: "Hand Tools" | "Electronics" | "Rapid Prototyping" | "Heavy Machinery";
  clearanceLevel: 1 | 2 | 3 | 4;
  trainingRequired: string;
  safetyGear: string[];
  location: string;
}

const DEFAULT_TOOLS: LabToolItem[] = [
  {
    id: "tool-multimeter",
    name: "Digital Multimeter & Oscilloscope",
    category: "Electronics",
    clearanceLevel: 1,
    trainingRequired: "General Electrical Safety SOP",
    safetyGear: ["Safety Glasses"],
    location: "BHEE 014 Lab Bench",
  },
  {
    id: "tool-soldering",
    name: "Temperature-Controlled Soldering Station",
    category: "Electronics",
    clearanceLevel: 2,
    trainingRequired: "Purdue IEEE Soldering Certification",
    safetyGear: ["Safety Glasses", "Fume Extractor"],
    location: "BHEE 014 Soldering Station",
  },
  {
    id: "tool-3dprinter",
    name: "Bambu Lab X1-Carbon 3D Printer",
    category: "Rapid Prototyping",
    clearanceLevel: 2,
    trainingRequired: "3D Printing & Slicing SOP",
    safetyGear: ["Safety Glasses"],
    location: "BHEE 014 3D Print Farm",
  },
  {
    id: "tool-laser",
    name: "CO2 Laser Cutter & Engraver",
    category: "Rapid Prototyping",
    clearanceLevel: 3,
    trainingRequired: "Laser Safety Officer (LSO) Training",
    safetyGear: ["Laser Safety Goggles", "Active Ventilation"],
    location: "BHEE Fabrication Bay",
  },
  {
    id: "tool-cnc",
    name: "Tormach CNC Mill & Lathe",
    category: "Heavy Machinery",
    clearanceLevel: 4,
    trainingRequired: "Bechtel / ME Machine Shop Clearance",
    safetyGear: ["Safety Glasses", "Closed-Toe Shoes", "Hearing Protection"],
    location: "Bechtel Innovation Design Center",
  },
];

interface LabToolSafetyGuideProps {
  tools?: LabToolItem[];
}

export function LabToolSafetyGuide({ tools = DEFAULT_TOOLS }: LabToolSafetyGuideProps) {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | "ALL">("ALL");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        search.trim() === "" ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.category.toLowerCase().includes(search.toLowerCase());

      const matchesLevel =
        selectedLevel === "ALL" || tool.clearanceLevel === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [tools, search, selectedLevel]);

  return (
    <div className="w-full space-y-6" aria-label="Lab Tool Safety and Clearance Guide">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="text-xl font-bold font-mono text-white">
            Equipment & Lab Safety Clearance Guide
          </h3>
        </div>
        <p className="text-sm text-neutral-400">
          Review required training certifications and PPE before operating technical lab equipment.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search lab equipment or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto" role="radiogroup" aria-label="Filter by Clearance Level">
          {(["ALL", 1, 2, 3, 4] as const).map((lvl) => (
            <button
              key={String(lvl)}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-primary text-black"
                  : "bg-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              {lvl === "ALL" ? "All Levels" : `Level ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 rounded-xl bg-neutral-900/60 border border-white/10 backdrop-blur-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                  {tool.category}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                    tool.clearanceLevel === 1
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : tool.clearanceLevel === 2
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : tool.clearanceLevel === 3
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  Clearance Level {tool.clearanceLevel}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-3">{tool.name}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Location: {tool.location}</p>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                <span>Training: {tool.trainingRequired}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                <span>Required PPE: {tool.safetyGear.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
