// ─── Google Calendar Configuration ──────────────────────────────
// Edit this file to connect a different calendar or rotate the API key.

export const CALENDAR_CONFIG = {
  /** Google Calendar API key (restricted to Calendar API) */
  apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,

  /** Public calendar ID */
  calendarId:
    "7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com",

  /** Max events to fetch */
  maxResults: 10,

  /** Timezone — must match the calendar's timezone */
  timeZone: "America/Indiana/Indianapolis",

  /** Auto-refresh interval in ms (5 minutes) */
  refreshInterval: 5 * 60 * 1000,
};
