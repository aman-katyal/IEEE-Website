import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { announceToScreenReader } from './ariaLive';

describe('announceToScreenReader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a polite live region in the DOM and sets announcement message', () => {
    announceToScreenReader('Showing 5 matching committees', 'polite');
    vi.advanceTimersByTime(100);

    const region = document.getElementById('aria-live-polite');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region?.textContent).toBe('Showing 5 matching committees');
  });

  it('creates an assertive live region for urgent updates', () => {
    announceToScreenReader('Payment rejected: Invalid PIN', 'assertive');
    vi.advanceTimersByTime(100);

    const region = document.getElementById('aria-live-assertive');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-live', 'assertive');
    expect(region?.textContent).toBe('Payment rejected: Invalid PIN');
  });
});
