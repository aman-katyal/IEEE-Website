import { useEffect } from 'react';

interface HotkeyOptions {
  /** If true, ignore events from within input/textarea/select elements */
  ignoreInputFields?: boolean;
}

/**
 * Parses a combo like 'ctrl+k', 'escape', 'shift+enter' into parts.
 */
function parseCombo(combo: string): { key: string; ctrl: boolean; meta: boolean; shift: boolean; alt: boolean } {
  const parts = combo.toLowerCase().split('+');
  const key = parts[parts.length - 1];
  return {
    key,
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('cmd') || parts.includes('meta'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  };
}

export function useHotkeys(
  combo: string,
  callback: (e: KeyboardEvent) => void,
  options: HotkeyOptions = {}
): void {
  const { ignoreInputFields = true } = options;
  useEffect(() => {
    const parsed = parseCombo(combo);
    const handler = (e: KeyboardEvent) => {
      if (ignoreInputFields) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      }
      if (
        e.key.toLowerCase() === parsed.key &&
        e.ctrlKey === parsed.ctrl &&
        e.metaKey === parsed.meta &&
        e.shiftKey === parsed.shift &&
        e.altKey === parsed.alt
      ) {
        callback(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [combo, callback, ignoreInputFields]);
}
