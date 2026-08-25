/**
 * File Extension and MIME Type Validation Utilities
 */

const ALLOWED_RECEIPT_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/heic',
]);

const ALLOWED_RECEIPT_EXTENSIONS = new Set([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'heic',
]);

export function getCleanFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()!.toLowerCase().trim();
}

export function isAllowedReceiptFileType(file: { name: string; type?: string }): boolean {
  if (!file || !file.name) return false;

  const ext = getCleanFileExtension(file.name);
  if (!ALLOWED_RECEIPT_EXTENSIONS.has(ext)) {
    return false;
  }

  if (file.type && !ALLOWED_RECEIPT_MIME_TYPES.has(file.type.toLowerCase())) {
    return false;
  }

  return true;
}
