import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns initial value when storage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>("test_key", "default_val")
    );
    expect(result.current[0]).toBe("default_val");
  });

  it("stores and updates values in localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage<{ count: number }>("counter_key", { count: 0 })
    );

    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
    expect(window.localStorage.getItem("counter_key")).toBe(
      JSON.stringify({ count: 5 })
    );
  });

  it("removes value from localStorage and resets to initial", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>("temp_key", "initial")
    );

    act(() => {
      result.current[1]("new_val");
    });
    expect(result.current[0]).toBe("new_val");

    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe("initial");
    expect(window.localStorage.getItem("temp_key")).toBeNull();
  });
});
