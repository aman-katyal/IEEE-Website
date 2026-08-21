import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useMagneticSpring, MAGNETIC_SPRING_CONFIG } from "./useMagneticSpring";

describe("useMagneticSpring", () => {
  it("provides initial spring values and config", () => {
    expect(MAGNETIC_SPRING_CONFIG.stiffness).toBe(150);
    expect(MAGNETIC_SPRING_CONFIG.damping).toBe(15);
    expect(MAGNETIC_SPRING_CONFIG.mass).toBe(0.1);

    const { result } = renderHook(() => useMagneticSpring(0.3));
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.onMouseEnter).toBe("function");
    expect(typeof result.current.onMouseMove).toBe("function");
    expect(typeof result.current.onMouseLeave).toBe("function");
  });

  it("resets on mouse leave", () => {
    const { result } = renderHook(() => useMagneticSpring(0.5));
    act(() => {
      result.current.onMouseLeave();
    });
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });
});
