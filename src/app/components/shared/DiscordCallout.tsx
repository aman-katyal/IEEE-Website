import { MessageSquare, ExternalLink, Users } from "lucide-react";

interface DiscordCalloutProps {
  memberCount?: string;
  onlineCount?: number;
  inviteUrl?: string;
}

export function DiscordCallout({
  memberCount = "1,800+",
  onlineCount = 142,
  inviteUrl = "https://discord.gg/purdueieee",
}: DiscordCalloutProps) {
  return (
    <div
      role="region"
      aria-label="Purdue IEEE Community Discord"
      className="p-6 rounded-xl bg-gradient-to-r from-[#5865F2]/20 via-[#5865F2]/10 to-transparent border border-[#5865F2]/30 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2] shrink-0">
          <MessageSquare className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Join the Community Discord</h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span>{onlineCount} Online</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Connect with {memberCount} Purdue engineers, committee leads, and alumni in real time.
          </p>
        </div>
      </div>

      <a
        href={inviteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-mono bg-[#5865F2] hover:bg-[#4752C4] text-white transition-colors shadow-md hover:shadow-lg cursor-pointer shrink-0"
      >
        <Users className="w-4 h-4" aria-hidden="true" />
        <span>Join Server</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
      </a>
    </div>
  );
}
