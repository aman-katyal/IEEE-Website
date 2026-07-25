import { render, fireEvent } from '@testing-library/react';
import { MagneticWrapper } from './MagneticWrapper';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MagneticWrapper Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getBoundingClientRect only once per hover interaction', () => {
    const getBoundingClientRectMock = vi.fn(() => ({
      left: 100, top: 100, width: 200, height: 50,
      bottom: 150, right: 300, x: 100, y: 100, toJSON: () => {}
    }));

    // @ts-ignore
    window.HTMLElement.prototype.getBoundingClientRect = getBoundingClientRectMock;

    const { getByText } = render(
      <MagneticWrapper><div>Hover me</div></MagneticWrapper>
    );

    const div = getByText('Hover me').parentElement;

    // Simulate hover
    fireEvent.mouseEnter(div!);

    // Simulate 100 mouse moves
    for (let i = 0; i < 100; i++) {
      fireEvent.mouseMove(div!, { clientX: 100 + i, clientY: 100 + i });
    }

    fireEvent.mouseLeave(div!);

    expect(getBoundingClientRectMock).toHaveBeenCalledTimes(1);

    // Simulate another hover sequence to ensure cache is cleared and recalculated
    fireEvent.mouseEnter(div!);
    fireEvent.mouseMove(div!, { clientX: 200, clientY: 200 });
    fireEvent.mouseLeave(div!);

    expect(getBoundingClientRectMock).toHaveBeenCalledTimes(2);
  });
});
