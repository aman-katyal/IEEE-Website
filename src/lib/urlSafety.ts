/**
 * Outbound URL and Link Safety Sanitizer
 * Prevents javascript:, data:, and malicious protocol execution.
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function isSafeHttpUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();

  // Allow relative URLs starting with / or #
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;

  try {
    const parsed = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(parsed.protocol.toLowerCase());
  } catch {
    return false;
  }
}

export function sanitizeExternalUrl(urlString: string, fallback = '#'): string {
  if (isSafeHttpUrl(urlString)) {
    return urlString.trim();
  }
  return fallback;
}
