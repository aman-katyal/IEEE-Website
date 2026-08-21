const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

/**
 * Formats a date into "MMM DD" (e.g., "JAN 05").
 * @param {Date} d - The date to format.
 * @returns {string} The formatted date string.
 */
export function fmtDate(d: Date): string {
  const month = monthFormatter.format(d).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return `${month} ${day}`;
}

/**
 * Formats a date into its short day name (e.g., "MON").
 * @param {Date} d - The date to format.
 * @returns {string} The formatted day string.
 */
export function fmtDay(d: Date): string {
  return dayFormatter.format(d).toUpperCase();
}

/**
 * Formats a date into a 4-digit year string.
 * @param {Date} d - The date to format.
 * @returns {string} The formatted year string.
 */
export function fmtYear(d: Date): string {
  return String(d.getFullYear());
}

/**
 * Formats a time range into "H:MM AM/PM – H:MM AM/PM".
 * @param {Date} start - The start time.
 * @param {Date} end - The end time.
 * @returns {string} The formatted time range string.
 */
export function fmtTime(start: Date, end: Date): string {
  const f = (d: Date) =>
    d
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  return `${f(start)} – ${f(end)}`;
}
