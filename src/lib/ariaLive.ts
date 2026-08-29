/**
 * ARIA Live Region Announcement Manager.
 * Injects invisible, screen-reader accessible live regions for dynamic search/filter updates (WCAG 2.2).
 */

export function getOrCreateRegion(mode: "polite" | "assertive"): HTMLElement | null {
  if (typeof document === "undefined") return null;

  const id = `aria-live-${mode}`;
  let el = document.getElementById(id);

  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.setAttribute("aria-live", mode);
    el.setAttribute("aria-atomic", "true");
    el.className = "sr-only";
    el.style.position = "absolute";
    el.style.width = "1px";
    el.style.height = "1px";
    el.style.padding = "0";
    el.style.margin = "-1px";
    el.style.overflow = "hidden";
    el.style.clip = "rect(0, 0, 0, 0)";
    el.style.whiteSpace = "nowrap";
    el.style.border = "0";
    document.body.appendChild(el);
  }

  return el;
}

/**
 * Announces a message to screen readers via an ARIA live region.
 */
export function announceToScreenReader(
  message: string,
  mode: "polite" | "assertive" = "polite"
): void {
  const region = getOrCreateRegion(mode);
  if (!region) return;

  // Clear briefly before updating to trigger re-announcement
  region.textContent = "";
  setTimeout(() => {
    if (region) {
      region.textContent = message;
    }
  }, 50);
}

export const announce = announceToScreenReader;
