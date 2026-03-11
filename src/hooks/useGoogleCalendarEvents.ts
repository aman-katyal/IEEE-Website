import { useState, useEffect, useCallback } from "react";
import { CALENDAR_CONFIG } from "../data/calendarConfig";

// ─── Types ──────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  /** Pre-built "Add to Google Calendar" URL */
  addToCalendarUrl: string;
  /** Original Google Calendar link */
  htmlLink: string;
}

interface GoogleCalendarItem {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
}

// ─── Helpers ────────────────────────────────────────────────────

function buildAddToCalendarUrl(event: GoogleCalendarItem): string {
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const startStr = event.start?.dateTime ?? event.start?.date ?? "";
  const endStr = event.end?.dateTime ?? event.end?.date ?? "";
  const start = fmt(new Date(startStr));
  const end = fmt(new Date(endStr));

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.summary ?? "Untitled Event",
    dates: `${start}/${end}`,
    details: event.description ?? "",
    location: event.location ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function parseEvent(item: GoogleCalendarItem): CalendarEvent {
  const startStr = item.start?.dateTime ?? item.start?.date ?? "";
  const endStr = item.end?.dateTime ?? item.end?.date ?? "";
  const isAllDay = !item.start?.dateTime;

  return {
    id: item.id,
    title: item.summary ?? "Untitled Event",
    description: item.description ?? "",
    location: item.location ?? "",
    start: new Date(startStr),
    end: new Date(endStr),
    isAllDay,
    addToCalendarUrl: buildAddToCalendarUrl(item),
    htmlLink: item.htmlLink ?? "",
  };
}

// ─── Hook ───────────────────────────────────────────────────────

export function useGoogleCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      const url = new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          CALENDAR_CONFIG.calendarId
        )}/events`
      );
      url.searchParams.set("key", CALENDAR_CONFIG.apiKey);
      url.searchParams.set("timeMin", now);
      url.searchParams.set("maxResults", String(CALENDAR_CONFIG.maxResults));
      url.searchParams.set("singleEvents", "true");
      url.searchParams.set("orderBy", "startTime");
      url.searchParams.set("timeZone", CALENDAR_CONFIG.timeZone);

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Calendar API ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const parsed = (data.items ?? []).map(parseEvent);
      setEvents(parsed);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch events";
      console.warn("[useGoogleCalendarEvents]", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    // Auto-refresh
    const interval = setInterval(fetchEvents, CALENDAR_CONFIG.refreshInterval);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return { events, loading, error };
}
