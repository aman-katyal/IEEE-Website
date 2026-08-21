import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTilt } from './useTilt';

// Mock motion/react to avoid complex spring internals in tests
vi.mock('motion/react', () => {
  const createMockMotionValue = (initial: number) => {
    let value = initial;
    return {
      get: () => value,
      set: (v: number) => { value = v; },
    };
  };

  return {
    useMotionValue: (initial: number) => createMockMotionValue(initial),
    useSpring: (mv: { get: () => number; set: (v: number) => void }) => mv,
    useTransform: (_mv: unknown, fn: () => string) => ({ get: fn }),
  };
});

describe('useTilt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the expected interface shape', () => {
    const { result } = renderHook(() => useTilt());
    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('style');
    expect(result.current).toHaveProperty('onMouseMove');
    expect(result.current).toHaveProperty('onMouseLeave');
    expect(typeof result.current.onMouseMove).toBe('function');
    expect(typeof result.current.onMouseLeave).toBe('function');
  });

  it('style has transform and willChange properties', () => {
    const { result } = renderHook(() => useTilt());
    expect(result.current.style).toHaveProperty('transform');
    expect(result.current.style).toHaveProperty('willChange', 'transform');
  });

  it('ref is a React ref object', () => {
    const { result } = renderHook(() => useTilt());
    expect(result.current.ref).toHaveProperty('current');
  });

  it('accepts custom options without error', () => {
    expect(() => {
      renderHook(() => useTilt({ maxTiltDeg: 20, scaleOnHover: 1.05 }));
    }).not.toThrow();
  });
});
