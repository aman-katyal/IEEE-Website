import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useHotkeys } from './useHotkeys';

function fireKeydown(overrides: Partial<KeyboardEventInit> & { target?: EventTarget } = {}) {
  const { target, ...init } = overrides;
  const event = new KeyboardEvent('keydown', { bubbles: true, ...init });
  if (target) {
    Object.defineProperty(event, 'target', { value: target, writable: false });
  }
  window.dispatchEvent(event);
  return event;
}

describe('useHotkeys', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fires callback on matching key', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys('escape', callback));
    fireKeydown({ key: 'Escape' });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not fire on non-matching key', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys('escape', callback));
    fireKeydown({ key: 'Enter' });
    expect(callback).not.toHaveBeenCalled();
  });

  it('respects ctrl modifier', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys('ctrl+k', callback));
    // Without ctrl — should NOT fire
    fireKeydown({ key: 'k' });
    expect(callback).not.toHaveBeenCalled();
    // With ctrl — should fire
    fireKeydown({ key: 'k', ctrlKey: true });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('respects shift modifier', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys('shift+enter', callback));
    fireKeydown({ key: 'Enter' });
    expect(callback).not.toHaveBeenCalled();
    fireKeydown({ key: 'Enter', shiftKey: true });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('ignores events from input elements by default', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys('escape', callback));
    const input = document.createElement('input');
    fireKeydown({ key: 'Escape', target: input });
    expect(callback).not.toHaveBeenCalled();
  });

  it('fires from input elements when ignoreInputFields=false', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys('escape', callback, { ignoreInputFields: false }));
    const input = document.createElement('input');
    fireKeydown({ key: 'Escape', target: input });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('removes listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const callback = vi.fn();
    const { unmount } = renderHook(() => useHotkeys('escape', callback));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
