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

  it('handles undefined document gracefully', () => {
    const originalDocument = global.document;
    // @ts-ignore
    delete global.document;

    announceToScreenReader('Should not throw', 'polite');

    global.document = originalDocument;
  });

  it('appends the live region to document.body', () => {
    announceToScreenReader('Test DOM append', 'polite');
    vi.advanceTimersByTime(100);

    const region = document.getElementById('aria-live-polite');
    expect(region).not.toBeNull();
    // Using type assertion to bypass TypeScript null check since we just asserted it is not null
    expect(document.body.contains(region as HTMLElement)).toBe(true);
  });
});
