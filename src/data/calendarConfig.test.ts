import { describe, it, expect } from 'vitest';
import { CALENDAR_CONFIG } from './calendarConfig';

describe('Google Calendar Configuration', () => {
  it('should load API key from environment variables', () => {
    const expectedKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || "AIzaSyCiHFpbbbSmpu60-2KpFdqIhoLaygoCAIA";
    expect(CALENDAR_CONFIG.apiKey).toBe(expectedKey);
  });

  it('should have a defined calendar ID', () => {
    expect(CALENDAR_CONFIG.calendarId).toBeDefined();
    expect(CALENDAR_CONFIG.calendarId).toContain('@group.calendar.google.com');
  });
});
