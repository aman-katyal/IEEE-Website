import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIntersectionObserver } from './useIntersectionObserver';

type IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => void;

describe('useIntersectionObserver', () => {
  let observerCallback: IntersectionObserverCallback | null = null;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockObserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDisconnect = vi.fn();
    mockObserve = vi.fn();
    observerCallback = null;

    class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts as not intersecting', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const [, isIntersecting] = result.current;
    expect(isIntersecting).toBe(false);
  });

  it('updates to true when observer fires with isIntersecting=true', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const { result, rerender } = renderHook(
      ({ triggerOnce }: { triggerOnce: boolean }) => {
        const [ref, isIntersecting] = useIntersectionObserver({ triggerOnce });
        // Assign the ref synchronously so useEffect sees it on first/subsequent render
        (ref as React.MutableRefObject<Element | null>).current = div;
        return { ref, isIntersecting };
      },
      { initialProps: { triggerOnce: false } }
    );

    // Re-render to ensure effect runs with the populated ref
    act(() => {
      rerender({ triggerOnce: false });
    });

    // Now fire the observer callback
    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(result.current.isIntersecting).toBe(true);
    document.body.removeChild(div);
  });

  it('disconnects after firing when triggerOnce=true', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const { result, rerender } = renderHook(
      ({ triggerOnce }: { triggerOnce: boolean }) => {
        const [ref, isIntersecting] = useIntersectionObserver({ triggerOnce });
        (ref as React.MutableRefObject<Element | null>).current = div;
        return { ref, isIntersecting };
      },
      { initialProps: { triggerOnce: true } }
    );

    act(() => {
      rerender({ triggerOnce: true });
    });

    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(mockDisconnect).toHaveBeenCalled();
    document.body.removeChild(div);
  });
});
