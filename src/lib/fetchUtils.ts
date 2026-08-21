interface RetryConfig {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
}

const RETRIABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

/**
 * Fetches a URL with exponential backoff retry on transient errors.
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  config?: RetryConfig
): Promise<Response> {
  const { maxAttempts = 3, initialDelayMs = 500, maxDelayMs = 4000 } = config ?? {};
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || !RETRIABLE_STATUSES.has(response.status)) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') throw err;
      lastError = err;
    }
    if (attempt < maxAttempts - 1) {
      const delay = Math.min(initialDelayMs * Math.pow(2, attempt), maxDelayMs);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
