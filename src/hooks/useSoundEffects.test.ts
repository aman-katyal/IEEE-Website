import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useSoundEffects } from "./useSoundEffects";

describe("useSoundEffects Hook", () => {
  it("initializes with sound disabled by default and allows toggling", () => {
    const { result } = renderHook(() => useSoundEffects());

    expect(result.current.soundEnabled).toBe(false);

    act(() => {
      result.current.setSoundEnabled(true);
    });

    expect(result.current.soundEnabled).toBe(true);
  });

  it("safely calls tone trigger functions without throwing in test environment", () => {
    const { result } = renderHook(() => useSoundEffects());

    act(() => {
      result.current.setSoundEnabled(true);
    });

    expect(() => {
      result.current.playClick();
      result.current.playSuccess();
      result.current.playToggle();
    }).not.toThrow();
  });
});
