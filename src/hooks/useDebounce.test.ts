import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("updates value after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: "first", delay: 500 } }
    );

    rerender({ val: "second", delay: 500 });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("second");
  });
});
