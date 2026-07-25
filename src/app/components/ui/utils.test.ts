import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("merges basic tailwind classes", () => {
    expect(cn("p-4", "m-2")).toBe("p-4 m-2");
  });

  it("merges conditional classes", () => {
    expect(cn("p-4", { "m-2": true, "text-red-500": false })).toBe("p-4 m-2");
  });

  it("merges arrays of classes", () => {
    expect(cn(["p-4", "m-2"])).toBe("p-4 m-2");
  });

  it("resolves conflicting tailwind classes by applying the last one", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("px-2 py-4", "p-8")).toBe("p-8");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles falsey values correctly", () => {
    expect(cn("p-4", null, undefined, false, 0, "", "m-2")).toBe("p-4 m-2");
  });
});
