export interface SpendingEntry {
  date: string;
  amount: number;
}

export interface SpendingVelocity {
  weeklyBurnRate: number;
  projectedEndBalance: number;
  runwayWeeks: number;
  status: "On Track" | "At Risk" | "Overdrawn";
}

export function calculateSpendingVelocity(
  spendingEntries: SpendingEntry[],
  totalBudget: number,
  semesterDays: number = 112,
): SpendingVelocity {
  if (totalBudget <= 0) {
    const totalSpent = spendingEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0,
    );
    return {
      weeklyBurnRate: 0,
      projectedEndBalance: -totalSpent,
      runwayWeeks: 0,
      status: "Overdrawn",
    };
  }

  if (spendingEntries.length === 0) {
    return {
      weeklyBurnRate: 0,
      projectedEndBalance: totalBudget,
      runwayWeeks: semesterDays / 7,
      status: "On Track",
    };
  }

  const timestamps = spendingEntries
    .map((e) => new Date(e.date).getTime())
    .filter((t) => !isNaN(t));
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps, Date.now());

  let elapsedDays = (maxTime - minTime) / (1000 * 60 * 60 * 24);
  if (elapsedDays < 7) {
    elapsedDays = 7;
  }

  const elapsedWeeks = elapsedDays / 7;

  const totalSpent = spendingEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );
  const weeklyBurnRate = totalSpent / elapsedWeeks;

  const semesterWeeks = semesterDays / 7;

  const projectedEndBalance = totalBudget - weeklyBurnRate * semesterWeeks;

  let runwayWeeks = 0;
  if (weeklyBurnRate > 0) {
    runwayWeeks = (totalBudget - totalSpent) / weeklyBurnRate;
  } else {
    runwayWeeks = semesterWeeks;
  }

  let status: "On Track" | "At Risk" | "Overdrawn" = "On Track";
  if (totalBudget - totalSpent < 0) {
    status = "Overdrawn";
  } else if (projectedEndBalance < 0) {
    status = "At Risk";
  }

  return {
    weeklyBurnRate: Math.round(weeklyBurnRate * 100) / 100,
    projectedEndBalance: Math.round(projectedEndBalance * 100) / 100,
    runwayWeeks: Math.round(runwayWeeks * 10) / 10,
    status,
  };
}
