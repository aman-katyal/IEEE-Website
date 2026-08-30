import { describe, it, expect } from "vitest";
import { calculateSpendingVelocity } from "./budgetUtils";

describe("calculateSpendingVelocity", () => {
  it("handles zero spending", () => {
    const result = calculateSpendingVelocity([], 1000, 112);
    expect(result.weeklyBurnRate).toBe(0);
    expect(result.projectedEndBalance).toBe(1000);
    expect(result.runwayWeeks).toBe(16);
    expect(result.status).toBe("On Track");
  });

  it("handles overspent budget", () => {
    const result = calculateSpendingVelocity(
      [{ date: "2024-01-01", amount: 1200 }],
      1000,
      112,
    );
    expect(result.status).toBe("Overdrawn");
  });

  it("handles zero budget", () => {
    const result = calculateSpendingVelocity(
      [{ date: "2024-01-01", amount: 100 }],
      0,
      112,
    );
    expect(result.status).toBe("Overdrawn");
    expect(result.projectedEndBalance).toBe(-100);
  });
});
