import * as React from "react";

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
  className?: string;
}

/**
 * Accessible skip-to-content navigation anchor.
 * Visually hidden until keyboard-focused via Tab.
 */
export function SkipLink({
  targetId = "#main-content",
  label = "Skip to main content",
  className = "",
}: SkipLinkProps) {
  return (
    <a
      href={targetId}
      className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--electric-blue)] focus:text-white focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--cyber-gold)] ${className}`.trim()}
    >
      {label}
    </a>
  );
}
