import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef } from 'react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('calls callback when clicking outside the ref element', () => {
    const callback = vi.fn();
    const outerDiv = document.createElement('div');
    document.body.appendChild(outerDiv);

    const innerDiv = document.createElement('div');
    document.body.appendChild(innerDiv);

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(innerDiv);
      useClickOutside(ref, callback);
      return ref;
    });

    void result;

    // Simulate click outside
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outerDiv, writable: false });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does NOT call callback when clicking inside the ref element', () => {
    const callback = vi.fn();
    const innerDiv = document.createElement('div');
    const childSpan = document.createElement('span');
    innerDiv.appendChild(childSpan);
    document.body.appendChild(innerDiv);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(innerDiv);
      useClickOutside(ref, callback);
    });

    // Simulate click inside
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: childSpan, writable: false });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('removes listeners on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const callback = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(div);
      useClickOutside(ref, callback);
    });

    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), { passive: true });
    expect(addSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });
});
