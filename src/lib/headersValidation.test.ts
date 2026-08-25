import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Production HTTP Response Headers Validation', () => {
  const headersPath = path.resolve(process.cwd(), 'public/_headers');

  it('validates _headers file exists and has strict security directives', () => {
    expect(fs.existsSync(headersPath)).toBe(true);

    const headersContent = fs.readFileSync(headersPath, 'utf-8');
    expect(headersContent).toContain('X-Content-Type-Options: nosniff');
    expect(headersContent).toContain('X-Frame-Options: SAMEORIGIN');
    expect(headersContent).toContain('Referrer-Policy: strict-origin-when-cross-origin');
    expect(headersContent).toContain('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    expect(headersContent).toContain('Content-Security-Policy:');
    expect(headersContent).toContain('Permissions-Policy:');
  });

  it('validates immutable caching headers for static assets', () => {
    const headersContent = fs.readFileSync(headersPath, 'utf-8');
    expect(headersContent).toContain('/assets/*');
    expect(headersContent).toContain('Cache-Control: public, max-age=31536000, immutable');
  });
});
