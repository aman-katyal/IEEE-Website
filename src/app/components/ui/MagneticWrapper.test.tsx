import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MagneticWrapper } from './MagneticWrapper';
import React from 'react';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, onMouseMove, onMouseLeave, style, ...props }: any) => (
      <div 
        data-testid="magnetic-div" 
        onMouseMove={onMouseMove} 
        onMouseLeave={onMouseLeave} 
        style={style}
        {...props}
      >
        {children}
      </div>
    ),
  },
  useMotionValue: (initial: number) => ({
    get: () => initial,
    set: vi.fn(),
  }),
  useSpring: (value: any) => value,
}));

describe('MagneticWrapper', () => {
  it('should render children', () => {
    render(
      <MagneticWrapper>
        <button>Click me</button>
      </MagneticWrapper>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should have magnetic effect properties', () => {
    // This test will fail because MagneticWrapper doesn't exist yet
    const { getByTestId } = render(
      <MagneticWrapper>
        <div>Target</div>
      </MagneticWrapper>
    );
    const wrapper = getByTestId('magnetic-div');
    expect(wrapper).toBeInTheDocument();
  });
});
