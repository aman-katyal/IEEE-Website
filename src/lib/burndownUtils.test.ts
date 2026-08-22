import { describe, it, expect } from 'vitest';
import { calculateBurndownForecast, type SpendingPoint } from './burndownUtils';

describe('calculateBurndownForecast', () => {
  it('handles zero spend state safely with infinite runway', () => {
    const forecast = calculateBurndownForecast([], 5000);
    expect(forecast.totalAllocated).toBe(5000);
    expect(forecast.totalSpent).toBe(0);
    expect(forecast.remainingBalance).toBe(5000);
    expect(forecast.weeklyBurnRate).toBe(0);
    expect(forecast.runwayWeeks).toBe(Infinity);
    expect(forecast.projectedZeroDate).toBeNull();
  });

  it('calculates weekly spend burn rate and runway correctly', () => {
    // Reference date: 2026-03-01 (4 weeks = 28 days after 2026-02-01)
    const refDate = new Date('2026-03-01T00:00:00Z');
    const spending: SpendingPoint[] = [
      { date: '2026-02-01', amount: 400 },
      { date: '2026-02-15', amount: 600 },
    ];
    // Total spent: 1000 over 4 weeks -> ~250/week.
    // Allocated: 5000 -> Remaining: 4000. Runway: 4000 / 250 = 16 weeks.

    const forecast = calculateBurndownForecast(spending, 5000, refDate);
    expect(forecast.totalSpent).toBe(1000);
    expect(forecast.remainingBalance).toBe(4000);
    expect(forecast.weeklyBurnRate).toBeCloseTo(250, 0);
    expect(forecast.runwayWeeks).toBeCloseTo(16, 0);
    expect(forecast.projectedZeroDate).toBeDefined();
    expect(forecast.confidenceBands.optimisticWeeks).toBeGreaterThan(forecast.runwayWeeks);
    expect(forecast.confidenceBands.pessimisticWeeks).toBeLessThan(forecast.runwayWeeks);
  });
});
