import { describe, it, expect } from "vitest";
import { groupBy } from "./groupUtils";

describe("groupBy Utility Suite", () => {
  it("groups items by key selector function", () => {
    const officers = [
      { name: "Alice", tier: "Executive" },
      { name: "Bob", tier: "Technical" },
      { name: "Charlie", tier: "Executive" },
      { name: "Dana", tier: "Operations" },
    ];

    const grouped = groupBy(officers, (o) => o.tier);

    expect(grouped.Executive.length).toBe(2);
    expect(grouped.Technical.length).toBe(1);
    expect(grouped.Operations.length).toBe(1);
    expect(grouped.Executive[0].name).toBe("Alice");
    expect(grouped.Executive[1].name).toBe("Charlie");
  });

  it("handles empty array gracefully", () => {
    const grouped = groupBy([], (x: any) => x.id);
    expect(grouped).toEqual({});
  });
});
