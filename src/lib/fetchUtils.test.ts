import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithRetry } from './fetchUtils';

function makeMockResponse(status: number, ok: boolean): Response {
  return { status, ok, headers: new Headers() } as unknown as Response;
}

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns response immediately on success', async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeMockResponse(200, true));
    vi.stubGlobal('fetch', mockFetch);

    const res = await fetchWithRetry('https://example.com');
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries on 503 and succeeds on second attempt', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(makeMockResponse(503, false))
      .mockResolvedValueOnce(makeMockResponse(200, true));
    vi.stubGlobal('fetch', mockFetch);

    const promise = fetchWithRetry('https://example.com', undefined, {
      maxAttempts: 3,
      initialDelayMs: 100,
    });
    await vi.runAllTimersAsync();
    const res = await promise;

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting all attempts', async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeMockResponse(503, false));
    vi.stubGlobal('fetch', mockFetch);

    const promise = fetchWithRetry('https://example.com', undefined, {
      maxAttempts: 3,
      initialDelayMs: 100,
    });
    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow('HTTP 503');
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('rethrows AbortError immediately without retrying', async () => {
    const abortError = Object.assign(new Error('Aborted'), { name: 'AbortError' });
    const mockFetch = vi.fn().mockRejectedValue(abortError);
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      fetchWithRetry('https://example.com', undefined, { maxAttempts: 3 })
    ).rejects.toMatchObject({ name: 'AbortError' });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('uses exponential backoff delay progression', async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeMockResponse(503, false));
    vi.stubGlobal('fetch', mockFetch);

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    const promise = fetchWithRetry('https://example.com', undefined, {
      maxAttempts: 3,
      initialDelayMs: 500,
      maxDelayMs: 4000,
    });
    await vi.runAllTimersAsync();
    await promise.catch(() => {});

    // Delays: attempt 0->1: 500ms, attempt 1->2: 1000ms
    const delays = setTimeoutSpy.mock.calls
      .filter(call => typeof call[1] === 'number' && (call[1] as number) > 0)
      .map(call => call[1] as number);

    expect(delays[0]).toBe(500);
    expect(delays[1]).toBe(1000);
  });
});
