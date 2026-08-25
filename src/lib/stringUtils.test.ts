import { describe, it, expect } from 'vitest';
import { truncateWords, slugify } from './stringUtils';

describe('stringUtils', () => {
  it('truncates text preserving word boundaries', () => {
    const text = 'Purdue IEEE Remotely Operated Vehicles Committee';
    expect(truncateWords(text, 20)).toBe('Purdue IEEE...');
    expect(truncateWords('Short text', 50)).toBe('Short text');
    expect(truncateWords('', 10)).toBe('');
  });

  it('slugifies titles and phrases cleanly into URL-friendly strings', () => {
    expect(slugify('Robotics & Automation Society')).toBe('robotics-automation-society');
    expect(slugify('  Purdue IEEE 2026!  ')).toBe('purdue-ieee-2026');
    expect(slugify('Multiple---Hyphens_And Spaces')).toBe('multiple-hyphens-and-spaces');
  });
});
