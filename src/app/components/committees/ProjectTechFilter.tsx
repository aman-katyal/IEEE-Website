import { Cpu, X } from "lucide-react";

interface ProjectTechFilterProps {
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export function ProjectTechFilter({
  allTags,
  selectedTags,
  onToggleTag,
  onClearTags,
}: ProjectTechFilterProps) {
  if (!allTags || allTags.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 backdrop-blur-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 font-semibold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span>Filter by Technology</span>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearTags}
            className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" aria-hidden="true" />
            <span>Reset ({selectedTags.length})</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Technology Stack Filters">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              aria-pressed={isSelected}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-black font-semibold shadow-sm"
                  : "bg-white/5 text-neutral-400 border border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
