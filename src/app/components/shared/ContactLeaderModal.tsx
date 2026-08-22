import { useState } from "react";
import { Mail, Check, Copy } from "lucide-react";
import { useClipboard } from "../../../hooks/useClipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";

interface ContactLeaderModalProps {
  name: string;
  role: string;
  email: string;
  trigger?: React.ReactNode;
}

export function ContactLeaderModal({
  name,
  role,
  email,
  trigger,
}: ContactLeaderModalProps) {
  const [open, setOpen] = useState(false);
  const { copy, hasCopied } = useClipboard({ timeoutMs: 2000 });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer">
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Contact</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-neutral-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Contact {name}</DialogTitle>
          <DialogDescription className="text-neutral-400 text-xs">
            {role} — Purdue IEEE Student Branch
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Mail className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span className="text-sm font-mono text-neutral-200 truncate">{email}</span>
          </div>

          <button
            onClick={() => copy(email)}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors cursor-pointer shrink-0"
            aria-label={`Copy email address ${email}`}
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <a
            href={`mailto:${email}`}
            className="px-4 py-2 rounded text-xs font-semibold bg-primary text-black hover:bg-primary/90 transition-colors"
          >
            Open Mail Client
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
