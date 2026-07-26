import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useIsMobile', () => {
  let addEventListenerMock: any;
  let removeEventListenerMock: any;
  let matchMediaMock: any;

  beforeEach(() => {
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();

    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));

    vi.stubGlobal('matchMedia', matchMediaMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns true when mobile breakpoint is met', () => {
    vi.stubGlobal('innerWidth', 500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('returns true at exact edge case (767px)', () => {
    vi.stubGlobal('innerWidth', 767);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false at exact edge case (768px)', () => {
    vi.stubGlobal('innerWidth', 768);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns false when desktop breakpoint is met', () => {
    vi.stubGlobal('innerWidth', 1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('updates when window width changes', () => {
    vi.stubGlobal('innerWidth', 1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate window resize and media query change event
    vi.stubGlobal('innerWidth', 500);
    act(() => {
      const onChangeListener = addEventListenerMock.mock.calls[0][1];
      onChangeListener();
    });

    expect(result.current).toBe(true);
  });

  it('cleans up event listener on unmount', () => {
    vi.stubGlobal('innerWidth', 1024);
    const { unmount } = renderHook(() => useIsMobile());

    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    const addedListener = addEventListenerMock.mock.calls[0][1];
    const removedListener = removeEventListenerMock.mock.calls[0][1];
    expect(addedListener).toBe(removedListener);
  });
});
