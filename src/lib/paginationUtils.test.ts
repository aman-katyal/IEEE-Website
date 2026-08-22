import { describe, it, expect } from "vitest";
import { paginate, filterByDateRange } from "./paginationUtils";

describe("paginationUtils Suite", () => {
  const items = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `Transaction ${i + 1}`,
    date: `2026-03-${String((i % 28) + 1).padStart(2, "0")}`,
  }));

  it("paginates items into slices correctly", () => {
    const page1 = paginate(items, 1, 10);
    expect(page1.data.length).toBe(10);
    expect(page1.totalPages).toBe(3);
    expect(page1.hasNextPage).toBe(true);
    expect(page1.hasPrevPage).toBe(false);

    const page3 = paginate(items, 3, 10);
    expect(page3.data.length).toBe(5);
    expect(page3.hasNextPage).toBe(false);
    expect(page3.hasPrevPage).toBe(true);
  });

  it("filters items within date ranges", () => {
    const filtered = filterByDateRange(
      items,
      (item) => item.date,
      "2026-03-05",
      "2026-03-10"
    );

    expect(filtered.length).toBe(6);
    expect(filtered[0].date).toBe("2026-03-05");
    expect(filtered[filtered.length - 1].date).toBe("2026-03-10");
  });
});
