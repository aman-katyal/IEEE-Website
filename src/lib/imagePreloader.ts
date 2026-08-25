/**
 * Above-the-Fold Critical Image Preload Helper
 * Injects <link rel="preload" as="image"> dynamically for fast LCP.
 */

const preloadedUrls = new Set<string>();

export function preloadImage(url: string, type = 'image/webp'): HTMLLinkElement | null {
  if (!url || typeof document === 'undefined') return null;
  if (preloadedUrls.has(url)) return null;

  preloadedUrls.add(url);
  const link = document.createElement('link');
  link.setAttribute('rel', 'preload');
  link.setAttribute('as', 'image');
  link.setAttribute('href', url);
  if (type) {
    link.setAttribute('type', type);
  }

  document.head.appendChild(link);
  return link;
}
