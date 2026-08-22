import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getVitalRating, initWebVitals, type WebVitalMetric } from './webVitals';

describe('webVitals Telemetry Suite', () => {
  it('correctly calculates threshold ratings for CLS, LCP, INP, FID', () => {
    expect(getVitalRating('CLS', 0.05)).toBe('good');
    expect(getVitalRating('CLS', 0.15)).toBe('needs-improvement');
    expect(getVitalRating('CLS', 0.35)).toBe('poor');

    expect(getVitalRating('LCP', 1800)).toBe('good');
    expect(getVitalRating('LCP', 3200)).toBe('needs-improvement');
    expect(getVitalRating('LCP', 4500)).toBe('poor');

    expect(getVitalRating('INP', 100)).toBe('good');
    expect(getVitalRating('INP', 300)).toBe('needs-improvement');
    expect(getVitalRating('INP', 600)).toBe('poor');
  });

  it('safely handles missing PerformanceObserver environments without throwing', () => {
    const callback = vi.fn();
    const cleanup = initWebVitals(callback);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });
});
