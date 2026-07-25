import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGoogleCalendarEvents } from './useGoogleCalendarEvents';

describe('useGoogleCalendarEvents', () => {
  let time = 1000000000000; // Arbitrary start time

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());

    // Add 10 minutes to time to bypass the 5 minute cache of the hook
    time += 10 * 60 * 1000;
    vi.spyOn(Date, 'now').mockReturnValue(time);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('handles network fetch errors correctly', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGoogleCalendarEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
  });

  it('handles API response errors correctly', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as Response);

    const { result } = renderHook(() => useGoogleCalendarEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Calendar API 500: Internal Server Error');
  });

  it('handles successful fetches correctly', async () => {
    const mockData = {
      items: [
        {
          id: '1',
          summary: 'Test Event',
          description: 'This is a test event',
          location: 'Test Location',
          start: { dateTime: '2025-01-01T12:00:00Z' },
          end: { dateTime: '2025-01-01T13:00:00Z' },
        }
      ]
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    } as Response);

    const { result } = renderHook(() => useGoogleCalendarEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0]).toMatchObject({
      id: '1',
      title: 'Test Event',
      description: 'This is a test event',
      location: 'Test Location',
      isAllDay: false,
    });
  });
});
