import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { enableVisualEditing } from '@sanity/visual-editing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the Sanity visual editing module
vi.mock('@sanity/visual-editing', () => ({
  enableVisualEditing: vi.fn(() => vi.fn()),
}));

describe('App Visual Editing Handshake', () => {
  let originalSelf: Window & typeof globalThis;
  let originalTop: WindowProxy | null;

  beforeEach(() => {
    // Save original window properties
    originalSelf = window.self;
    originalTop = window.top;

    // Clear mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore window properties
    Object.defineProperty(window, 'self', { value: originalSelf, configurable: true });
    Object.defineProperty(window, 'top', { value: originalTop, configurable: true });
  });

  it('should enable visual editing when inside an iframe', () => {
    // Mock window to simulate being in an iframe
    Object.defineProperty(window, 'self', { value: {}, configurable: true });
    Object.defineProperty(window, 'top', { value: { window: {} }, configurable: true });

    // Ensure self !== top
    expect(window.self).not.toBe(window.top);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Verify enableVisualEditing was called
    expect(enableVisualEditing).toHaveBeenCalled();
  });
});
