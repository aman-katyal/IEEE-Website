import { describe, it, expect } from 'vitest';
import {
  getCleanFileExtension,
  isAllowedReceiptFileType,
} from './fileValidation';

describe('fileValidation', () => {
  it('extracts clean lowercase file extensions', () => {
    expect(getCleanFileExtension('receipt.PDF')).toBe('pdf');
    expect(getCleanFileExtension('invoice_2026.png')).toBe('png');
    expect(getCleanFileExtension('noextension')).toBe('');
  });

  it('validates allowed receipt types and rejects unsafe extensions', () => {
    expect(
      isAllowedReceiptFileType({ name: 'receipt.pdf', type: 'application/pdf' })
    ).toBe(true);
    expect(
      isAllowedReceiptFileType({ name: 'photo.jpg', type: 'image/jpeg' })
    ).toBe(true);
    expect(
      isAllowedReceiptFileType({ name: 'malicious.exe', type: 'application/x-msdownload' })
    ).toBe(false);
    expect(
      isAllowedReceiptFileType({ name: 'script.js', type: 'application/javascript' })
    ).toBe(false);
    expect(
      isAllowedReceiptFileType({ name: 'page.html', type: 'text/html' })
    ).toBe(false);
  });
});
