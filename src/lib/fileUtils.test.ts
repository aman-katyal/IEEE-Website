import { describe, it, expect } from 'vitest';
import { formatBytes } from './fileUtils';

describe('formatBytes', () => {
  it('returns "0 Bytes" for 0', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('returns "0 Bytes" for negative values', () => {
    expect(formatBytes(-1)).toBe('0 Bytes');
  });

  it('uses Bytes scale for values < 1024', () => {
    expect(formatBytes(1023)).toContain('Bytes');
  });

  it('returns "1 KB" for 1024', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('returns "1 MB" for 1048576', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('respects decimals parameter', () => {
    expect(formatBytes(1500, 1)).toBe('1.5 KB');
  });

  it('defaults to 2 decimal places', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});

describe('detectFileSignature & validateFileExtensionMatch', () => {
  it('detects PDF signature (%PDF)', () => {
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]);
    expect(detectFileSignature(pdfBytes)).toBe('pdf');
    expect(validateFileExtensionMatch('receipt.pdf', pdfBytes)).toBe(true);
    expect(validateFileExtensionMatch('receipt.png', pdfBytes)).toBe(false);
  });

  it('detects PNG signature', () => {
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00]);
    expect(detectFileSignature(pngBytes)).toBe('png');
    expect(validateFileExtensionMatch('image.png', pngBytes)).toBe(true);
    expect(validateFileExtensionMatch('image.pdf', pngBytes)).toBe(false);
  });

  it('detects JPEG signature', () => {
    const jpegBytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
    expect(detectFileSignature(jpegBytes)).toBe('jpeg');
    expect(validateFileExtensionMatch('photo.jpg', jpegBytes)).toBe(true);
    expect(validateFileExtensionMatch('photo.jpeg', jpegBytes)).toBe(true);
    expect(validateFileExtensionMatch('photo.pdf', jpegBytes)).toBe(false);
  });

  it('detects GIF signature', () => {
    const gifBytes = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    expect(detectFileSignature(gifBytes)).toBe('gif');
    expect(validateFileExtensionMatch('anim.gif', gifBytes)).toBe(true);
  });

  it('detects WEBP signature', () => {
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x00
    ]);
    expect(detectFileSignature(webpBytes)).toBe('webp');
    expect(validateFileExtensionMatch('asset.webp', webpBytes)).toBe(true);
  });

  it('returns null and false for unknown/corrupted signatures', () => {
    const junkBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    expect(detectFileSignature(junkBytes)).toBeNull();
    expect(validateFileExtensionMatch('malicious.exe.pdf', junkBytes)).toBe(false);
    expect(validateFileExtensionMatch('noext', junkBytes)).toBe(false);
  });
});

