import { describe, it, expect } from 'vitest';
import { fmtDate, fmtDay, fmtYear, fmtTime } from './dateUtils';

describe('dateUtils', () => {
  it('fmtDate formats correctly', () => {
    const d1 = new Date('2026-01-05T12:00:00');
    expect(fmtDate(d1)).toBe('JAN 05');

    const d2 = new Date('2026-12-31T23:59:59');
    expect(fmtDate(d2)).toBe('DEC 31');
  });

  it('fmtDay formats correctly', () => {
    // 2026-01-05 is a Monday
    const d1 = new Date('2026-01-05T12:00:00');
    expect(fmtDay(d1)).toBe('MON');

    // 2026-01-04 is a Sunday
    const d2 = new Date('2026-01-04T12:00:00');
    expect(fmtDay(d2)).toBe('SUN');
  });

  it('fmtYear formats correctly', () => {
    const d1 = new Date('2026-01-05T12:00:00');
    expect(fmtYear(d1)).toBe('2026');
  });

  it('fmtTime formats correctly', () => {
    const start = new Date('2026-01-05T09:30:00');
    const end = new Date('2026-01-05T11:00:00');
    expect(fmtTime(start, end)).toBe('9:30 AM – 11:00 AM');

    const startNoon = new Date('2026-01-05T12:00:00');
    const endMidnight = new Date('2026-01-06T00:00:00');
    expect(fmtTime(startNoon, endMidnight)).toBe('12:00 PM – 12:00 AM');
  });
});
