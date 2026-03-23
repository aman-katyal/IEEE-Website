import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { MemoryRouter } from 'react-router';
import { enableVisualEditing } from '@sanity/visual-editing';

// Mock @sanity/visual-editing
vi.mock('@sanity/visual-editing', () => ({
  enableVisualEditing: vi.fn(() => vi.fn()),
}));

describe('App Visual Editing Handshake', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enable visual editing when inside an iframe', () => {
    // Mock iframe environment
    const originalSelf = window.self;
    const originalTop = window.top;
    
    // In jsdom, we need to define these
    Object.defineProperty(window, 'self', { value: {}, configurable: true });
    Object.defineProperty(window, 'top', { value: { window: {} }, configurable: true });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(enableVisualEditing).toHaveBeenCalled();

    // Restore originals
    Object.defineProperty(window, 'self', { value: originalSelf });
    Object.defineProperty(window, 'top', { value: originalTop });
  });
});
