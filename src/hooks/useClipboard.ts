import { useState, useCallback, useRef, useEffect } from "react";

export interface UseClipboardOptions {
  timeoutMs?: number;
}

export interface UseClipboardResult {
  hasCopied: boolean;
  copy: (text: string) => Promise<boolean>;
  error: Error | null;
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardResult {
  const { timeoutMs = 2000 } = options;
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback using textarea execCommand
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setHasCopied(true);
        setError(null);

        timeoutRef.current = setTimeout(() => {
          setHasCopied(false);
        }, timeoutMs);

        return true;
      } catch (err) {
        const copyError =
          err instanceof Error ? err : new Error("Failed to copy to clipboard");
        setError(copyError);
        setHasCopied(false);
        return false;
      }
    },
    [timeoutMs]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { hasCopied, copy, error };
}
