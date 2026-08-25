import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Cloudflare Pages SPA and Routing Configuration', () => {
  const publicDir = path.resolve(process.cwd(), 'public');

  it('validates _redirects has SPA fallback routing rule', () => {
    const redirectsPath = path.join(publicDir, '_redirects');
    expect(fs.existsSync(redirectsPath)).toBe(true);

    const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
    expect(redirectsContent.replace(/\s+/g, ' ').trim()).toContain('/* /index.html 200');
  });

  it('validates _routes.json exists and is valid JSON', () => {
    const routesPath = path.join(publicDir, '_routes.json');
    expect(fs.existsSync(routesPath)).toBe(true);

    const routesContent = fs.readFileSync(routesPath, 'utf-8');
    const parsed = JSON.parse(routesContent);
    expect(parsed.version).toBe(1);
    expect(Array.isArray(parsed.include)).toBe(true);
    expect(Array.isArray(parsed.exclude)).toBe(true);
  });
});
