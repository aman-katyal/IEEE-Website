/**
 * Financial Burndown Velocity & Forecasting Utility.
 * Computes weekly spend burn rate and projected budget exhaustion dates with confidence bands.
 */

export interface SpendingPoint {
  date: string; // ISO date string YYYY-MM-DD
  amount: number;
}

export interface BurndownForecast {
  totalAllocated: number;
  totalSpent: number;
  remainingBalance: number;
  weeklyBurnRate: number; // $/week
  runwayWeeks: number;
  projectedZeroDate: string | null;
  confidenceBands: {
    optimisticWeeks: number; // lower spend rate
    expectedWeeks: number;
    pessimisticWeeks: number; // higher spend rate
  };
}

/**
 * Computes weekly spend rate, projected budget runway, and confidence bands.
 */
export function calculateBurndownForecast(
  spendingPoints: SpendingPoint[],
  totalAllocated: number,
  referenceDate = new Date()
): BurndownForecast {
  const totalSpent = spendingPoints.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = Math.max(0, totalAllocated - totalSpent);

  if (spendingPoints.length === 0 || totalSpent <= 0) {
    return {
      totalAllocated,
      totalSpent,
      remainingBalance,
      weeklyBurnRate: 0,
      runwayWeeks: Infinity,
      projectedZeroDate: null,
      confidenceBands: {
        optimisticWeeks: Infinity,
        expectedWeeks: Infinity,
        pessimisticWeeks: Infinity,
      },
    };
  }

  // Find date range
  const timestamps = spendingPoints.map((p) => new Date(p.date).getTime()).filter((t) => !isNaN(t));
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps, referenceDate.getTime());
  const elapsedDays = Math.max(7, (maxTime - minTime) / (1000 * 60 * 60 * 24));
  const elapsedWeeks = elapsedDays / 7;

  const weeklyBurnRate = totalSpent / elapsedWeeks;
  const expectedWeeks = weeklyBurnRate > 0 ? remainingBalance / weeklyBurnRate : Infinity;

  // Confidence multipliers
  const optimisticWeeks = weeklyBurnRate > 0 ? remainingBalance / (weeklyBurnRate * 0.75) : Infinity;
  const pessimisticWeeks = weeklyBurnRate > 0 ? remainingBalance / (weeklyBurnRate * 1.35) : Infinity;

  let projectedZeroDate: string | null = null;
  if (isFinite(expectedWeeks)) {
    const zeroTimestamp = referenceDate.getTime() + expectedWeeks * 7 * 24 * 60 * 60 * 1000;
    projectedZeroDate = new Date(zeroTimestamp).toISOString().split('T')[0];
  }

  return {
    totalAllocated,
    totalSpent: Math.round(totalSpent * 100) / 100,
    remainingBalance: Math.round(remainingBalance * 100) / 100,
    weeklyBurnRate: Math.round(weeklyBurnRate * 100) / 100,
    runwayWeeks: Math.round(expectedWeeks * 10) / 10,
    projectedZeroDate,
    confidenceBands: {
      optimisticWeeks: Math.round(optimisticWeeks * 10) / 10,
      expectedWeeks: Math.round(expectedWeeks * 10) / 10,
      pessimisticWeeks: Math.round(pessimisticWeeks * 10) / 10,
    },
  };
}
