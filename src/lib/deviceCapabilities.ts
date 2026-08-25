/**
 * Client-Side Device and Browser Capabilities Detection
 */

export function supportsTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function supportsWebShare(): boolean {
  if (typeof navigator === 'undefined') return false;
  return typeof navigator.share === 'function';
}

export function supportsClipboard(): boolean {
  if (typeof navigator === 'undefined') return false;
  return !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
}

export function supportsWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
