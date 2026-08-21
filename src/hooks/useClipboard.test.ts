import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useClipboard } from "./useClipboard";

describe("useClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("copies text successfully using navigator.clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    const { result } = renderHook(() => useClipboard({ timeoutMs: 1500 }));

    expect(result.current.hasCopied).toBe(false);

    let success: boolean = false;
    await act(async () => {
      success = await result.current.copy("Hello IEEE");
    });

    expect(success).toBe(true);
    expect(result.current.hasCopied).toBe(true);
    expect(writeText).toHaveBeenCalledWith("Hello IEEE");

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.hasCopied).toBe(false);
  });
});
