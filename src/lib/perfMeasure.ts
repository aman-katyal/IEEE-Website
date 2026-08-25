/**
 * Performance Mark & Measure Helper
 * Safely captures user interaction and component render timings using User Timing API.
 */

export function markStart(markName: string): void {
  if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
    try {
      performance.mark(`${markName}-start`);
    } catch {
      // Ignore performance mark errors
    }
  }
}

export function markEnd(markName: string): number | null {
  if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
    try {
      const startMark = `${markName}-start`;
      const endMark = `${markName}-end`;
      const measureName = `${markName}-measure`;

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);

      const entries = performance.getEntriesByName(measureName, 'measure');
      const duration = entries.length > 0 ? entries[entries.length - 1].duration : null;

      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);

      return duration;
    } catch {
      return null;
    }
  }
  return null;
}
