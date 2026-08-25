import { describe, it, expect } from 'vitest';
import { getContrastRatio, meetsWcagAA } from './colorContrast';

describe('colorContrast', () => {
  it('calculates contrast between black and white as 21:1', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBe(21);
    expect(meetsWcagAA('#000000', '#ffffff')).toBe(true);
  });

  it('correctly validates WCAG AA contrast thresholds', () => {
    // #717182 against #ffffff is approx 4.7:1 (passes normal)
    expect(meetsWcagAA('#717182', '#ffffff')).toBe(true);
    // #cccccc against #ffffff fails normal
    expect(meetsWcagAA('#cccccc', '#ffffff')).toBe(false);
  });

  it('handles 3-character hex shorthand strings', () => {
    expect(getContrastRatio('#000', '#fff')).toBe(21);
  });
});
