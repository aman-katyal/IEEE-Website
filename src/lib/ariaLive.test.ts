import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { announceToScreenReader, getOrCreateRegion } from './ariaLive';

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

describe('getOrCreateRegion', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates a new live region in document.body when one does not exist', () => {
    const region = getOrCreateRegion('polite');
    expect(region).not.toBeNull();
    expect(document.body.contains(region)).toBe(true);
    expect(document.getElementById('aria-live-polite')).toBe(region);
  });

  it('reuses an existing live region if it already exists', () => {
    const firstRegion = getOrCreateRegion('assertive');
    const secondRegion = getOrCreateRegion('assertive');

    expect(firstRegion).not.toBeNull();
    expect(firstRegion).toBe(secondRegion);

    const regions = document.querySelectorAll('#aria-live-assertive');
    expect(regions.length).toBe(1);
  });

  it('returns null if document is undefined', () => {
    const originalDocument = global.document;
    // @ts-ignore
    delete (global as any).document;

    const region = getOrCreateRegion('polite');
    expect(region).toBeNull();

    global.document = originalDocument;
  });
});
