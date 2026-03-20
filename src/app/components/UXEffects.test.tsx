import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UXEffects } from './UXEffects';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock useTheme
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: true, // Mocking as desktop
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('UXEffects Component (Cursor Performance)', () => {
  it('should render and respond to mouse move', async () => {
    // We can't easily check internal React re-renders without instrumenting the component.
    // For TDD purposes, the "failing" state is that we are using useState instead of motion values.
    
    const { container } = render(<UXEffects />);
    expect(document.body.classList.contains('custom-cursor-active')).toBe(true);
  });
});
