import { describe, it, expect, beforeEach } from 'vitest';
import { preloadImage } from './imagePreloader';

describe('imagePreloader', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('injects preload link element into document.head', () => {
    const url = '/images/hero-banner-test.webp';
    const el = preloadImage(url, 'image/webp');

    expect(el).not.toBeNull();
    const link = document.head.querySelector('link[rel="preload"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe(url);
    expect(link?.getAttribute('as')).toBe('image');
  });

  it('deduplicates preloads for the same URL', () => {
    const url = '/images/duplicate-test.webp';
    const first = preloadImage(url);
    const second = preloadImage(url);

    expect(first).not.toBeNull();
    expect(second).toBeNull();
    expect(document.head.querySelectorAll(`link[href="${url}"]`)).toHaveLength(1);
  });
});
