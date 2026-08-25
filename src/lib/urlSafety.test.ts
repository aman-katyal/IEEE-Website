import { describe, it, expect } from 'vitest';
import { isSafeHttpUrl, sanitizeExternalUrl } from './urlSafety';

describe('urlSafety', () => {
  it('allows safe HTTPS and HTTP URLs', () => {
    expect(isSafeHttpUrl('https://purdueieee.org')).toBe(true);
    expect(isSafeHttpUrl('http://purdue.edu/')).toBe(true);
    expect(isSafeHttpUrl('mailto:president@purdueieee.org')).toBe(true);
    expect(isSafeHttpUrl('tel:+17654946724')).toBe(true);
  });

  it('allows internal relative paths', () => {
    expect(isSafeHttpUrl('/committees/rov')).toBe(true);
    expect(isSafeHttpUrl('#main-content')).toBe(true);
  });

  it('blocks dangerous protocols like javascript: and data:', () => {
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeHttpUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeHttpUrl('file:///etc/passwd')).toBe(false);
  });

  it('sanitizes external URLs with fallback', () => {
    expect(sanitizeExternalUrl('https://google.com')).toBe('https://google.com');
    expect(sanitizeExternalUrl('javascript:evil()')).toBe('#');
    expect(sanitizeExternalUrl('javascript:evil()', '/safe')).toBe('/safe');
  });
});
