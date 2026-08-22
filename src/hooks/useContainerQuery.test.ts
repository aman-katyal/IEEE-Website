import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useContainerQuery } from "./useContainerQuery";

describe("useContainerQuery Hook", () => {
  it("initializes with default dimensions and ref", () => {
    const { result } = renderHook(() => useContainerQuery());
    const [ref, dimensions] = result.current;

    expect(ref.current).toBeNull();
    expect(dimensions.width).toBe(0);
    expect(dimensions.isSm).toBe(false);
    expect(dimensions.isMd).toBe(false);
  });
});
