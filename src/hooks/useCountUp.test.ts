import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCountUp } from './useCountUp';

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let frame = 0;
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      frame++;
      // Simulate timestamp advancing 100ms each frame
      setTimeout(() => cb(frame * 100), 0);
      return frame;
    });
  });
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

  it('returns 0 when start=false', () => {
    const { result } = renderHook(() => useCountUp(100, 1000, false));
    expect(result.current).toBe(0);
  });

  it('counts up when start=true', async () => {
    const { result } = renderHook(() => useCountUp(100, 200, true));
    await act(async () => { vi.runAllTimers(); });
    expect(result.current).toBe(100);
  });

  it('returns 0 for zero target even when start=true', () => {
    const { result } = renderHook(() => useCountUp(0, 1000, true));
    expect(result.current).toBe(0);
  });
});
