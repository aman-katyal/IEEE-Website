import { describe, it, expect } from 'vitest';
import { schemaTypes } from './index';

describe('Sanity Studio Schema Contract Suite', () => {
  it('registers all required document and object schemas', () => {
    expect(schemaTypes.length).toBeGreaterThanOrEqual(8);
    const schemaNames = schemaTypes.map((s) => s.name);
    
    // Core document schemas
    expect(schemaNames).toContain('committee');
    expect(schemaNames).toContain('leader');
    expect(schemaNames).toContain('cornerstone');
    expect(schemaNames).toContain('officersConfig');
    expect(schemaNames).toContain('siteSettings');
    expect(schemaNames).toContain('homePage');
    expect(schemaNames).toContain('aboutPage');
    expect(schemaNames).toContain('partner');
  });

  it('validates that every schema has a name, type, and field definitions', () => {
    for (const schema of schemaTypes) {
      expect(schema.name).toBeDefined();
      expect(typeof schema.name).toBe('string');
      expect(schema.type).toBeDefined();
      expect(Array.isArray(schema.fields)).toBe(true);
      expect(schema.fields.length).toBeGreaterThan(0);
    }
  });

  it('validates that leader schema fields match Leader TypeScript interface', () => {
    const leaderSchema = schemaTypes.find((s) => s.name === 'leader');
    expect(leaderSchema).toBeDefined();
    const fieldNames = leaderSchema!.fields.map((f: any) => f.name);

    expect(fieldNames).toContain('name');
    expect(fieldNames).toContain('role');
    expect(fieldNames).toContain('email');
    expect(fieldNames).toContain('image');
    expect(fieldNames).toContain('category');
    expect(fieldNames).toContain('order');
  });

  it('validates that homePage schema fields match HomePageData TypeScript interface', () => {
    const homeSchema = schemaTypes.find((s) => s.name === 'homePage');
    expect(homeSchema).toBeDefined();
    const fieldNames = homeSchema!.fields.map((f: any) => f.name);

    expect(fieldNames).toContain('heroTitle');
    expect(fieldNames).toContain('heroSubtitle');
    expect(fieldNames).toContain('heroImage');
    expect(fieldNames).toContain('aboutTitle');
    expect(fieldNames).toContain('aboutContent');
    expect(fieldNames).toContain('stats');
  });

  it('validates that aboutPage schema fields match AboutPageData TypeScript interface', () => {
    const aboutSchema = schemaTypes.find((s) => s.name === 'aboutPage');
    expect(aboutSchema).toBeDefined();
    const fieldNames = aboutSchema!.fields.map((f: any) => f.name);

    expect(fieldNames).toContain('quote');
    expect(fieldNames).toContain('timeline');
    expect(fieldNames).toContain('sections');
  });
});
