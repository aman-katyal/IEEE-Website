/**
 * iCalendar (.ics) RFC 5545 Generation & Download Utility.
 */

export interface IcsEventOptions {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}

function formatIcsDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/**
 * Generates an RFC 5545 compliant .ics string for a calendar event.
 */
export function generateIcsContent(event: IcsEventOptions): string {
  const dtStart = formatIcsDate(event.start);
  const dtEnd = formatIcsDate(event.end);
  const now = formatIcsDate(new Date());
  const uid = `${Date.now()}-${Math.floor(Math.random() * 100000)}@purdueieee.org`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Purdue IEEE//Website Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title.replace(/\n/g, "\\n")}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : "",
    event.location ? `LOCATION:${event.location.replace(/\n/g, "\\n")}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

/**
 * Initiates client-side file download for an .ics file.
 */
export function downloadIcsFile(event: IcsEventOptions, filename = "event.ics"): void {
  if (typeof document === "undefined") return;

  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
