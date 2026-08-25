import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRovingFocus } from './useRovingFocus';
import { KeyboardEvent } from 'react';

describe('useRovingFocus', () => {
  it('manages focused index and cycles on arrow keys', () => {
    const { result } = renderHook(() => useRovingFocus(3, 0));

    expect(result.current.focusedIndex).toBe(0);
    expect(result.current.getTabIndex(0)).toBe(0);
    expect(result.current.getTabIndex(1)).toBe(-1);

    act(() => {
      const event = {
        key: 'ArrowRight',
        preventDefault: () => {},
      } as unknown as KeyboardEvent<HTMLElement>;
      result.current.handleKeyDown(event);
    });

    expect(result.current.focusedIndex).toBe(1);
    expect(result.current.getTabIndex(1)).toBe(0);

    act(() => {
      const event = {
        key: 'End',
        preventDefault: () => {},
      } as unknown as KeyboardEvent<HTMLElement>;
      result.current.handleKeyDown(event);
    });

    expect(result.current.focusedIndex).toBe(2);
  });
});
