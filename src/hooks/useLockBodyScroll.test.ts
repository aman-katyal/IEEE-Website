import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLockBodyScroll } from './useLockBodyScroll';

describe('useLockBodyScroll', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('sets overflow: hidden when locked=true', () => {
    renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores original overflow on unmount', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does nothing when locked=false', () => {
    renderHook(() => useLockBodyScroll(false));
    expect(document.body.style.overflow).toBe('');
  });
});
