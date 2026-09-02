import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIdleTimer } from './useIdleTimer';

describe('useIdleTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('calls onIdle after timeout elapses', () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleTimer(onIdle, 5000));
    vi.advanceTimersByTime(5000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('resets timer on user event (mousemove) and does not fire early', () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleTimer(onIdle, 5000));

    // Advance 3 seconds, simulate activity
    vi.advanceTimersByTime(3000);
    window.dispatchEvent(new Event('mousemove'));

    // Advance 3 more seconds (only 3s since reset)
    vi.advanceTimersByTime(3000);
    expect(onIdle).not.toHaveBeenCalled();

    // Advance 2 more seconds to complete timeout from reset
    vi.advanceTimersByTime(2000);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('does not call onIdle if user remains active', () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleTimer(onIdle, 5000));

    // Fire activity every 4 seconds — never idle
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(4000);
      window.dispatchEvent(new Event('click'));
    }

    expect(onIdle).not.toHaveBeenCalled();
  });

  it('cleanup removes all event listeners', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const onIdle = vi.fn();
    const { unmount } = renderHook(() => useIdleTimer(onIdle, 5000));
    unmount();
    // Should have removed listeners for: mousemove, keydown, touchstart, scroll, click
    expect(removeSpy).toHaveBeenCalledTimes(5);
  });

  it('does not call onIdle when enabled is false', () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleTimer(onIdle, 5000, false));
    vi.advanceTimersByTime(10000);
    expect(onIdle).not.toHaveBeenCalled();
  });
});

