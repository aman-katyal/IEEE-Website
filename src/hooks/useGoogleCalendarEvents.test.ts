import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('../data/calendarConfig', () => ({
  CALENDAR_CONFIG: {
    apiKey: 'test-api-key',
    calendarId: 'test-calendar-id',
    maxResults: 10,
    timeZone: 'America/Indiana/Indianapolis',
    refreshInterval: 5 * 60 * 1000,
  },
}));

describe('useGoogleCalendarEvents', () => {
  const getHook = async () => {
    vi.resetModules();
    const mod = await import('./useGoogleCalendarEvents');
    return mod.useGoogleCalendarEvents;
  };

  beforeEach(() => {
    mockFetch.mockReset();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should initialize with loading state and fetch successfully for standard events', async () => {
    const useGoogleCalendarEvents = await getHook();
    const mockData = {
      items: [
        {
          id: '1',
          summary: 'Test Event',
          description: 'A test description',
          location: 'Test Location',
          start: { dateTime: '2023-01-01T10:00:00Z' },
          end: { dateTime: '2023-01-01T11:00:00Z' },
        }
      ]
    };

    const fetchResponse = {
      ok: true,
      json: () => Promise.resolve(mockData)
    };

    // The fetch implementation calls .then() multiple times, so the mock needs to return a proper promise chain.
    mockFetch.mockReturnValueOnce(Promise.resolve(fetchResponse));

    const { result } = renderHook(() => useGoogleCalendarEvents());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toHaveLength(1);
    const event = result.current.events[0];
    expect(event.id).toBe('1');
    expect(event.title).toBe('Test Event');
    expect(event.description).toBe('A test description');
    expect(event.location).toBe('Test Location');
    expect(event.start.toISOString()).toBe('2023-01-01T10:00:00.000Z');
    expect(event.end.toISOString()).toBe('2023-01-01T11:00:00.000Z');
    expect(event.isAllDay).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should parse all-day events correctly', async () => {
    const useGoogleCalendarEvents = await getHook();
    const mockData = {
      items: [
        {
          id: '2',
          summary: 'All Day Event',
          start: { date: '2023-01-02' },
          end: { date: '2023-01-03' },
        }
      ]
    };

    const fetchResponse = {
      ok: true,
      json: () => Promise.resolve(mockData)
    };

    mockFetch.mockReturnValueOnce(Promise.resolve(fetchResponse));

    const { result } = renderHook(() => useGoogleCalendarEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events[0].isAllDay).toBe(true);
    expect(result.current.events[0].start.toISOString()).toBe(new Date('2023-01-02').toISOString());
  });

  it('should handle fetch failure', async () => {
    const useGoogleCalendarEvents = await getHook();

    const fetchResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    };

    mockFetch.mockReturnValueOnce(Promise.resolve(fetchResponse));

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useGoogleCalendarEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe('Calendar API 500: Internal Server Error');

    consoleWarnSpy.mockRestore();
  });

  it('should handle network error', async () => {
    const useGoogleCalendarEvents = await getHook();

    // We must reject the promise directly to simulate a network error
    mockFetch.mockReturnValueOnce(Promise.reject(new Error('Network Error')));
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useGoogleCalendarEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network Error');
    consoleWarnSpy.mockRestore();
  });

  it('should cache data and not fetch again within refresh interval', async () => {
    const useGoogleCalendarEvents = await getHook();

    const mockData = {
      items: [{ id: '1', summary: 'Cached Event', start: { date: '2023-01-01' }, end: { date: '2023-01-02' } }]
    };

    const fetchResponse = {
      ok: true,
      json: () => Promise.resolve(mockData)
    };

    mockFetch.mockReturnValueOnce(Promise.resolve(fetchResponse));

    const { result, unmount } = renderHook(() => useGoogleCalendarEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCalls = mockFetch.mock.calls.length;
    expect(initialCalls).toBeGreaterThan(0);

    unmount();

    // Render hook again
    const { result: result2 } = renderHook(() => useGoogleCalendarEvents());

    // Should be initialized with cached data and not loading
    expect(result2.current.loading).toBe(false);
    expect(result2.current.events).toHaveLength(1);

    // Fetch should not have been called again since cache is valid
    expect(mockFetch.mock.calls.length).toBe(initialCalls);
  });

  it('should deduplicate concurrent fetches', async () => {
    const useGoogleCalendarEvents = await getHook();

    const mockData = {
      items: [{ id: '1', summary: 'Concurrent Event', start: { date: '2023-01-01' }, end: { date: '2023-01-02' } }]
    };

    let resolveFetch: (value: any) => void;

    // To mock a pending fetch, we need to return a promise that hasn't resolved yet
    // The promise MUST resolve to an object with an `ok` property and a `json` function
    // because `fetchPromise.then((res) => { if(!res.ok) ... return res.json() })` happens in the hook
    const fetchPromise = new Promise<any>((resolve) => {
      resolveFetch = resolve;
    });

    mockFetch.mockReturnValueOnce(fetchPromise);

    const hook1 = renderHook(() => useGoogleCalendarEvents());
    const hook2 = renderHook(() => useGoogleCalendarEvents());
    const hook3 = renderHook(() => useGoogleCalendarEvents());

    // Only one network request should be in flight
    expect(mockFetch.mock.calls.length).toBe(1);

    expect(hook1.result.current.loading).toBe(true);
    expect(hook2.result.current.loading).toBe(true);
    expect(hook3.result.current.loading).toBe(true);

    act(() => {
      resolveFetch({
        ok: true,
        json: () => Promise.resolve(mockData)
      });
    });

    await waitFor(() => {
      expect(hook1.result.current.loading).toBe(false);
    });

    expect(hook2.result.current.loading).toBe(false);
    expect(hook3.result.current.loading).toBe(false);

    expect(hook1.result.current.events).toHaveLength(1);
    expect(hook2.result.current.events).toHaveLength(1);
    expect(hook3.result.current.events).toHaveLength(1);
  });
});
