import { useState, useCallback, KeyboardEvent } from 'react';

/**
 * useRovingFocus Hook
 * Implements roving tabindex pattern for accessible keyboard navigation in tablists and button groups.
 */
export function useRovingFocus(itemCount: number, initialIndex = 0) {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (itemCount === 0) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % itemCount);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        }
        case 'Home': {
          e.preventDefault();
          setFocusedIndex(0);
          break;
        }
        case 'End': {
          e.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
        }
      }
    },
    [itemCount]
  );

  const getTabIndex = useCallback(
    (index: number) => (index === focusedIndex ? 0 : -1),
    [focusedIndex]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    getTabIndex,
  };
}
