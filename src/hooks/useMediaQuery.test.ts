import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  let listeners: ((e: MediaQueryListEvent) => void)[] = [];

  beforeEach(() => {
    listeners = [];
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("max-width: 768px"),
        media: query,
        addEventListener: vi.fn((_, cb) => listeners.push(cb)),
        removeEventListener: vi.fn(),
      }))
    );
  });

  it("returns true when media query matches", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("returns false when media query does not match", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 1200px)"));
    expect(result.current).toBe(false);
  });

  it("updates when media query event fires", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);

    act(() => {
      listeners.forEach((listener) =>
        listener({ matches: false } as MediaQueryListEvent)
      );
    });

    expect(result.current).toBe(false);
  });
});
