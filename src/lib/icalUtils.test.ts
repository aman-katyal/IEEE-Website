import { describe, it, expect } from "vitest";
import { generateIcsContent, type IcsEventOptions } from "./icalUtils";

describe("generateIcsContent", () => {
  it("generates valid RFC 5545 iCalendar string with event details", () => {
    const event: IcsEventOptions = {
      title: "IEEE General Meeting",
      description: "Callout meeting for all technical committees",
      location: "EE 129, Purdue University",
      start: new Date("2026-09-01T23:00:00.000Z"),
      end: new Date("2026-09-02T00:30:00.000Z"),
    };

    const ics = generateIcsContent(event);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:IEEE General Meeting");
    expect(ics).toContain("LOCATION:EE 129, Purdue University");
    expect(ics).toContain("DTSTART:20260901T230000Z");
    expect(ics).toContain("DTEND:20260902T003000Z");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });
});
