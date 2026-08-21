import { describe, it, expect } from 'vitest';
import { formatBytes } from './fileUtils';

describe('formatBytes', () => {
  it('returns "0 Bytes" for 0', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('returns "0 Bytes" for negative values', () => {
    expect(formatBytes(-1)).toBe('0 Bytes');
  });

  it('uses Bytes scale for values < 1024', () => {
    expect(formatBytes(1023)).toContain('Bytes');
  });

  it('returns "1 KB" for 1024', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('returns "1 MB" for 1048576', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('respects decimals parameter', () => {
    expect(formatBytes(1500, 1)).toBe('1.5 KB');
  });

  it('defaults to 2 decimal places', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});
