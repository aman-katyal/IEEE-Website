import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Production SEO Configuration Validation', () => {
  const publicDir = path.resolve(process.cwd(), 'public');

  it('validates robots.txt exists, allows all agents, and points to sitemap', () => {
    const robotsPath = path.join(publicDir, 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);

    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Sitemap: https://purdueieee.org/sitemap.xml');
  });

  it('validates sitemap.xml contains valid XML syntax and canonical URLs', () => {
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    expect(sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('https://purdueieee.org/');
    expect(sitemapContent).toContain('https://purdueieee.org/about');
    expect(sitemapContent).toContain('https://purdueieee.org/committees');
    expect(sitemapContent).toContain('https://purdueieee.org/officers');
    expect(sitemapContent).toContain('https://purdueieee.org/calendar');
    expect(sitemapContent).toContain('https://purdueieee.org/join');
    expect(sitemapContent).toContain('https://purdueieee.org/partners');
    expect(sitemapContent).toContain('https://purdueieee.org/constitution');
    expect(sitemapContent).toContain('</urlset>');
  });
});
