import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateReceiptKey,
  validateReceiptKey,
  getFileExtension,
  getMimeType,
  isAllowedContentType,
  isAllowedExtension,
  validateReceiptFile,
  sanitizePathSegment,
  MockR2Storage,
  putReceipt,
  getReceipt,
  deleteReceipt,
  clearDefaultMockStorage,
  MAX_RECEIPT_SIZE_BYTES,
  ALLOWED_RECEIPT_EXTENSIONS,
  ALLOWED_RECEIPT_MIME_TYPES,
} from './r2';

describe('BoilerBooks R2 Storage & Key Generation', () => {
  beforeEach(() => {
    clearDefaultMockStorage();
  });

  describe('Key Generation & Path Sanitization', () => {
    it('should generate canonical R2 receipt storage keys', () => {
      const key = generateReceiptKey('fy25-26', 'rov', 'invoice_digikey.pdf');
      expect(key).toMatch(/^receipts\/fy25-26\/rov\/[0-9a-f-]{36}\.pdf$/);
      expect(validateReceiptKey(key)).toBe(true);
    });

    it('should sanitize fiscal year, committee ID, and uppercase extension', () => {
      const key = generateReceiptKey('FY 25/26', 'IEEE Racing Team', 'RECEIPT.PNG');
      expect(key).toMatch(/^receipts\/fy_25_26\/ieee_racing_team\/[0-9a-f-]{36}\.png$/);
      expect(validateReceiptKey(key)).toBe(true);
    });

    it('should handle filenames with multiple dots or unusual characters', () => {
      const key = generateReceiptKey('2025-2026', 'aesc', 'part.order.v2.FINAL.jpeg');
      expect(key).toMatch(/^receipts\/2025-2026\/aesc\/[0-9a-f-]{36}\.jpeg$/);
      expect(validateReceiptKey(key)).toBe(true);
    });

    it('should sanitize path segments safely', () => {
      expect(sanitizePathSegment('../../../etc/passwd')).toBe('etc_passwd');
      expect(sanitizePathSegment('   special @#$% chars!   ')).toBe('special_chars');
      expect(sanitizePathSegment('')).toBe('unknown');
    });

    it('should validate canonical receipt keys properly', () => {
      const validKey = 'receipts/fy25-26/rov/123e4567-e89b-12d3-a456-426614174000.pdf';
      expect(validateReceiptKey(validKey)).toBe(true);

      expect(validateReceiptKey('invalid/path/key.pdf')).toBe(false);
      expect(validateReceiptKey('receipts/fy/rov')).toBe(false);
      expect(validateReceiptKey('')).toBe(false);
    });
  });

  describe('Content-Type & File Extension Validation', () => {
    it('should extract file extensions accurately', () => {
      expect(getFileExtension('invoice.pdf')).toBe('.pdf');
      expect(getFileExtension('PHOTO.PNG')).toBe('.png');
      expect(getFileExtension('document.WEBP')).toBe('.webp');
      expect(getFileExtension('noextension')).toBe('');
      expect(getFileExtension('')).toBe('');
    });

    it('should resolve correct MIME types from filenames', () => {
      expect(getMimeType('invoice.pdf')).toBe('application/pdf');
      expect(getMimeType('photo.png')).toBe('image/png');
      expect(getMimeType('image.jpg')).toBe('image/jpeg');
      expect(getMimeType('image.jpeg')).toBe('image/jpeg');
      expect(getMimeType('asset.webp')).toBe('image/webp');
      expect(getMimeType('archive.zip')).toBeNull();
    });

    it('should correctly allow all official receipt MIME types and extensions', () => {
      expect(ALLOWED_RECEIPT_EXTENSIONS).toEqual(['.pdf', '.png', '.jpg', '.jpeg', '.webp']);
      expect(ALLOWED_RECEIPT_MIME_TYPES).toEqual([
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/webp',
      ]);

      for (const ext of ALLOWED_RECEIPT_EXTENSIONS) {
        expect(isAllowedExtension(`test${ext}`)).toBe(true);
      }

      for (const mime of ALLOWED_RECEIPT_MIME_TYPES) {
        expect(isAllowedContentType(mime)).toBe(true);
        expect(isAllowedContentType(`${mime}; charset=utf-8`)).toBe(true);
      }
    });

    it('should reject disallowed file extensions and MIME types', () => {
      const badExtensions = ['exe', 'sh', 'html', 'js', 'zip', 'tar', 'docx', 'xlsx'];
      for (const ext of badExtensions) {
        expect(isAllowedExtension(`file.${ext}`)).toBe(false);
      }

      const badMimes = ['text/html', 'application/javascript', 'application/zip', 'audio/mp3'];
      for (const mime of badMimes) {
        expect(isAllowedContentType(mime)).toBe(false);
      }
    });

    it('should validate receipt upload file objects and enforce 15MB max limit', () => {
      // Valid cases
      expect(
        validateReceiptFile({
          filename: 'invoice.pdf',
          size: 1024 * 1024, // 1 MB
          contentType: 'application/pdf',
        })
      ).toEqual({ valid: true });

      expect(
        validateReceiptFile({
          filename: 'receipt.png',
          size: MAX_RECEIPT_SIZE_BYTES, // Exactly 15 MB
          contentType: 'image/png',
        })
      ).toEqual({ valid: true });

      // Missing filename
      expect(
        validateReceiptFile({
          filename: '',
          size: 1000,
        }).valid
      ).toBe(false);

      // 0 byte file
      expect(
        validateReceiptFile({
          filename: 'empty.pdf',
          size: 0,
        }).valid
      ).toBe(false);

      // Oversized file (> 15 MB)
      const oversized = validateReceiptFile({
        filename: 'huge_scan.pdf',
        size: MAX_RECEIPT_SIZE_BYTES + 1,
      });
      expect(oversized.valid).toBe(false);
      expect(oversized.error).toContain('exceeds maximum limit of 15 MB');

      // Disallowed extension
      const badExt = validateReceiptFile({
        filename: 'payload.exe',
        size: 5000,
      });
      expect(badExt.valid).toBe(false);
      expect(badExt.error).toContain('Unsupported file extension');

      // Disallowed content type
      const badType = validateReceiptFile({
        filename: 'photo.png',
        size: 5000,
        contentType: 'application/x-msdownload',
      });
      expect(badType.valid).toBe(false);
      expect(badType.error).toContain('Unsupported content type');
    });
  });

  describe('Storage Engine Operations (Mock & Top-Level Functions)', () => {
    it('should store and retrieve binary receipt data in MockR2Storage', async () => {
      const mockStorage = new MockR2Storage();
      const testKey = generateReceiptKey('fy25-26', 'rov', 'test_receipt.pdf');
      const testContent = 'PDF-1.7 mock binary content for Purdue IEEE ROV';
      const testBytes = new TextEncoder().encode(testContent);

      const putRes = await putReceipt(mockStorage, testKey, testBytes, {
        contentType: 'application/pdf',
        customMetadata: { uploader: 'alex@purdue.edu' },
      });

      expect(putRes.key).toBe(testKey);
      expect(putRes.size).toBe(testBytes.length);
      expect(putRes.contentType).toBe('application/pdf');

      // Retrieve
      const getRes = await getReceipt(mockStorage, testKey);
      expect(getRes).not.toBeNull();
      expect(getRes?.key).toBe(testKey);
      expect(getRes?.size).toBe(testBytes.length);
      expect(getRes?.contentType).toBe('application/pdf');
      expect(getRes?.customMetadata?.uploader).toBe('alex@purdue.edu');

      const retrievedText = await getRes!.text();
      expect(retrievedText).toBe(testContent);

      const retrievedBuffer = await getRes!.arrayBuffer();
      expect(Array.from(new Uint8Array(retrievedBuffer))).toEqual(Array.from(testBytes));
    });

    it('should store string data and auto-detect content type from key', async () => {
      const mockStorage = new MockR2Storage();
      const testKey = generateReceiptKey('fy25-26', 'racing', 'receipt.png');

      await putReceipt(mockStorage, testKey, 'image-png-binary-data');
      const item = await getReceipt(mockStorage, testKey);

      expect(item).not.toBeNull();
      expect(item?.contentType).toBe('image/png');
    });

    it('should delete stored receipts successfully', async () => {
      const mockStorage = new MockR2Storage();
      const testKey = generateReceiptKey('fy25-26', 'embs', 'spec.pdf');

      await putReceipt(mockStorage, testKey, 'some content');
      expect(await getReceipt(mockStorage, testKey)).not.toBeNull();

      const deleted = await deleteReceipt(mockStorage, testKey);
      expect(deleted).toBe(true);

      const afterDelete = await getReceipt(mockStorage, testKey);
      expect(afterDelete).toBeNull();
    });

    it('should fallback to default mock storage when bucket argument is undefined', async () => {
      const testKey = generateReceiptKey('fy25-26', 'cs', 'cloud_receipt.webp');
      const testData = new Uint8Array([10, 20, 30, 40]);

      // Call without explicit bucket instance
      await putReceipt(undefined, testKey, testData, { contentType: 'image/webp' });

      const retrieved = await getReceipt(undefined, testKey);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.data).toEqual(testData);
      expect(retrieved?.contentType).toBe('image/webp');

      await deleteReceipt(undefined, testKey);
      expect(await getReceipt(undefined, testKey)).toBeNull();
    });

    it('should return null when retrieving non-existent keys', async () => {
      const res = await getReceipt(undefined, 'receipts/fy25-26/rov/nonexistent-key.pdf');
      expect(res).toBeNull();
    });

    it('should test MockR2Storage head and clear methods', async () => {
      const storage = new MockR2Storage();
      const key = generateReceiptKey('fy25-26', 'social', 'flyer.jpg');

      await storage.put(key, 'flyer bytes', {
        httpMetadata: { contentType: 'image/jpeg' },
      });

      const head = await storage.head(key);
      expect(head).not.toBeNull();
      expect(head?.key).toBe(key);
      expect(head?.httpMetadata?.contentType).toBe('image/jpeg');

      expect(storage.size).toBe(1);
      storage.clear();
      expect(storage.size).toBe(0);
      expect(await storage.head(key)).toBeNull();
    });
  });
});
