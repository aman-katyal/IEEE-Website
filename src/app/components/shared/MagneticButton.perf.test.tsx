import { render, fireEvent } from '@testing-library/react';
import { MagneticButton } from './MagneticButton';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MagneticButton Performance', () => {
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
      <MemoryRouter>
        <MagneticButton>Hover me</MagneticButton>
      </MemoryRouter>
    );

    const button = getByText('Hover me');

    // Simulate hover
    fireEvent.mouseEnter(button);

    // Simulate 100 mouse moves
    for (let i = 0; i < 100; i++) {
      fireEvent.mouseMove(button, { clientX: 100 + i, clientY: 100 + i });
    }

    fireEvent.mouseLeave(button);

    // It should be called once on enter
    expect(getBoundingClientRectMock).toHaveBeenCalledTimes(1);

    // Simulate another hover sequence to ensure cache is cleared and recalculated
    fireEvent.mouseEnter(button);
    fireEvent.mouseMove(button, { clientX: 200, clientY: 200 });
    fireEvent.mouseLeave(button);

    expect(getBoundingClientRectMock).toHaveBeenCalledTimes(2);
  });
});
