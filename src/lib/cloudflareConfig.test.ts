import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Cloudflare Pages SPA and Routing Configuration', () => {
  const rootDir = process.cwd();
  const publicDir = path.resolve(rootDir, 'public');

  it('validates wrangler.jsonc has single-page-application not_found_handling', () => {
    const wranglerPath = path.join(rootDir, 'wrangler.jsonc');
    expect(fs.existsSync(wranglerPath)).toBe(true);

    const content = fs.readFileSync(wranglerPath, 'utf-8');
    expect(content).toContain('"not_found_handling": "single-page-application"');
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
