import { describe, it, expect, vi } from 'vitest';

/**
 * Helper to determine the preview URL based on environment.
 * Matches implementation in sanity.config.ts
 */
function getPreviewUrl(hostname: string): string {
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5173';
  }
  return 'https://ieee-website-9ix.pages.dev';
}

describe('Preview URL Resolution', () => {
  it('should return localhost for local hostnames', () => {
    expect(getPreviewUrl('localhost')).toBe('http://localhost:5173');
  });

  it('should return the production URL for other hostnames', () => {
    expect(getPreviewUrl('purdue-ieee-website.sanity.studio')).toBe('https://ieee-website-9ix.pages.dev');
  });

  it('should handle 127.0.0.1 specifically', () => {
    expect(getPreviewUrl('127.0.0.1')).toBe('http://localhost:5173');
  });
});
