import { describe, it, expect } from 'vitest';
import {
  supportsTouch,
  supportsWebShare,
  supportsClipboard,
  supportsWebGL,
} from './deviceCapabilities';

describe('deviceCapabilities', () => {
  it('detects clipboard capability in environment', () => {
    expect(typeof supportsClipboard()).toBe('boolean');
  });

  it('detects touch capabilities', () => {
    expect(typeof supportsTouch()).toBe('boolean');
  });

  it('detects web share API presence safely without errors', () => {
    expect(typeof supportsWebShare()).toBe('boolean');
  });

  it('detects WebGL support gracefully without throwing', () => {
    expect(typeof supportsWebGL()).toBe('boolean');
  });
});
