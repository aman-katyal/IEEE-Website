import { describe, it, expect } from 'vitest';
import { CALENDAR_CONFIG } from './calendarConfig';

describe('Google Calendar Configuration', () => {
  it('should load API key from environment variables', () => {
    // This is expected to fail initially as the key is currently hardcoded
    // and the environment variable VITE_GOOGLE_CALENDAR_API_KEY is not yet defined.
    expect(CALENDAR_CONFIG.apiKey).toBe(import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY);
  });

  it('should have a defined calendar ID', () => {
    expect(CALENDAR_CONFIG.calendarId).toBeDefined();
    expect(CALENDAR_CONFIG.calendarId).toContain('@group.calendar.google.com');
  });
});
