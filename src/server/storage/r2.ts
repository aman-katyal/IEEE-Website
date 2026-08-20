/**
 * Cloudflare R2 Receipt Storage Helper & Mock Fallback Engine
 * Purdue IEEE BoilerBooks 3.0
 */

export const MAX_RECEIPT_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes

export const ALLOWED_RECEIPT_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'] as const;
export type AllowedReceiptExtension = (typeof ALLOWED_RECEIPT_EXTENSIONS)[number];

export const ALLOWED_RECEIPT_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;
export type AllowedReceiptMimeType = (typeof ALLOWED_RECEIPT_MIME_TYPES)[number];

const EXTENSION_TO_MIME_MAP: Record<string, AllowedReceiptMimeType> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

export const MIME_TO_EXTENSION_MAP: Record<AllowedReceiptMimeType, AllowedReceiptExtension> = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

/**
 * Cloudflare R2-compatible object header interface
 */
export interface R2ObjectHeaderLike {
  key: string;
  size: number;
  etag?: string;
  uploaded: Date;
  httpMetadata?: {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    cacheControl?: string;
  };
  customMetadata?: Record<string, string>;
}

/**
 * Cloudflare R2-compatible object body interface
 */
export interface R2ObjectBodyLike extends R2ObjectHeaderLike {
  body?: ReadableStream;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
}

/**
 * Cloudflare R2-compatible Bucket interface
 */
export interface R2BucketLike {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: {
      httpMetadata?: { contentType?: string };
      customMetadata?: Record<string, string>;
    }
  ): Promise<R2ObjectHeaderLike | null>;
  get(key: string): Promise<R2ObjectBodyLike | null>;
  delete(keys: string | string[]): Promise<void>;
  head?(key: string): Promise<R2ObjectHeaderLike | null>;
}

export interface ReceiptStorageResult {
  key: string;
  size: number;
  etag?: string;
  contentType: string;
  uploaded: Date;
}

export interface ReceiptObject {
  key: string;
  size: number;
  contentType: string;
  data: Uint8Array;
  uploaded: Date;
  customMetadata?: Record<string, string>;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
}

/**
 * Extracts file extension with leading dot in lower case.
 */
export function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';
  const cleanName = filename.trim();
  const lastDot = cleanName.lastIndexOf('.');
  if (lastDot === -1 || lastDot === cleanName.length - 1) return '';
  return cleanName.slice(lastDot).toLowerCase();
}

/**
 * Resolves standard MIME type for given filename extension.
 */
export function getMimeType(filename: string): AllowedReceiptMimeType | null {
  const ext = getFileExtension(filename);
  return EXTENSION_TO_MIME_MAP[ext] || null;
}

/**
 * Validates whether content type is an accepted receipt MIME type.
 */
export function isAllowedContentType(contentType: string): boolean {
  if (!contentType || typeof contentType !== 'string') return false;
  const normalized = contentType.split(';')[0].trim().toLowerCase();
  return ALLOWED_RECEIPT_MIME_TYPES.includes(normalized as AllowedReceiptMimeType);
}

/**
 * Validates whether filename has an accepted receipt extension.
 */
export function isAllowedExtension(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ALLOWED_RECEIPT_EXTENSIONS.includes(ext as AllowedReceiptExtension);
}

/**
 * Validates receipt upload file metadata (filename, size, MIME type).
 */
export function validateReceiptFile(file: {
  filename: string;
  size: number;
  contentType?: string;
}): { valid: boolean; error?: string } {
  if (!file.filename || typeof file.filename !== 'string' || file.filename.trim().length === 0) {
    return { valid: false, error: 'Filename is required' };
  }

  if (typeof file.size !== 'number' || file.size <= 0) {
    return { valid: false, error: 'File size must be greater than 0 bytes' };
  }

  if (file.size > MAX_RECEIPT_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum limit of 15 MB`,
    };
  }

  if (!isAllowedExtension(file.filename)) {
    return {
      valid: false,
      error: `Unsupported file extension. Allowed extensions: ${ALLOWED_RECEIPT_EXTENSIONS.join(', ')}`,
    };
  }

  if (file.contentType && !isAllowedContentType(file.contentType)) {
    return {
      valid: false,
      error: `Unsupported content type "${file.contentType}". Allowed types: ${ALLOWED_RECEIPT_MIME_TYPES.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes path segments (removes path traversal and non-alphanumeric chars).
 */
export function sanitizePathSegment(segment: string): string {
  if (!segment || typeof segment !== 'string') return 'unknown';
  return segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '') || 'unknown';
}

/**
 * Generates canonical R2 receipt storage key:
 * `receipts/{fiscal_year}/{committee_id}/{uuid}.{ext}`
 */
export function generateReceiptKey(
  fiscalYear: string,
  committeeId: string,
  filename: string
): string {
  const cleanFiscalYear = sanitizePathSegment(fiscalYear);
  const cleanCommittee = sanitizePathSegment(committeeId);
  const ext = getFileExtension(filename) || '.pdf';
  const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext;
  const uniqueId = crypto.randomUUID();

  return `receipts/${cleanFiscalYear}/${cleanCommittee}/${uniqueId}.${cleanExt}`;
}

/**
 * Validates whether a storage key follows the canonical receipts format.
 */
export function validateReceiptKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  return /^receipts\/[a-z0-9_-]+\/[a-z0-9_-]+\/[0-9a-f-]{36}\.[a-z0-9]+$/i.test(key);
}

/**
 * In-memory Mock R2 Bucket Storage for testing and local development.
 */
export class MockR2Storage implements R2BucketLike {
  private store = new Map<
    string,
    {
      data: Uint8Array;
      uploaded: Date;
      contentType: string;
      customMetadata?: Record<string, string>;
      etag: string;
    }
  >();

  async put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: {
      httpMetadata?: { contentType?: string };
      customMetadata?: Record<string, string>;
    }
  ): Promise<R2ObjectHeaderLike | null> {
    if (!key || typeof key !== 'string') {
      throw new Error('Key must be a non-empty string');
    }

    let bytes: Uint8Array;

    if (value === null) {
      bytes = new Uint8Array(0);
    } else if (typeof value === 'string') {
      bytes = new TextEncoder().encode(value);
    } else if (value instanceof Uint8Array) {
      bytes = value;
    } else if (value instanceof ArrayBuffer) {
      bytes = new Uint8Array(value);
    } else if (ArrayBuffer.isView(value)) {
      bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    } else if (typeof (value as Blob).arrayBuffer === 'function') {
      const buf = await (value as Blob).arrayBuffer();
      bytes = new Uint8Array(buf);
    } else {
      // ReadableStream fallback
      const reader = (value as ReadableStream).getReader();
      const chunks: Uint8Array[] = [];
      let totalLen = 0;
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        if (chunk) {
          chunks.push(chunk);
          totalLen += chunk.length;
        }
      }
      bytes = new Uint8Array(totalLen);
      let offset = 0;
      for (const c of chunks) {
        bytes.set(c, offset);
        offset += c.length;
      }
    }

    const contentType = options?.httpMetadata?.contentType || getMimeType(key) || 'application/octet-stream';
    const etag = `mock-etag-${Date.now()}-${bytes.length}`;
    const uploaded = new Date();

    this.store.set(key, {
      data: bytes,
      uploaded,
      contentType,
      customMetadata: options?.customMetadata,
      etag,
    });

    return {
      key,
      size: bytes.length,
      etag,
      uploaded,
      httpMetadata: { contentType },
      customMetadata: options?.customMetadata,
    };
  }

  async get(key: string): Promise<R2ObjectBodyLike | null> {
    const item = this.store.get(key);
    if (!item) return null;

    const { data, uploaded, contentType, customMetadata, etag } = item;

    return {
      key,
      size: data.length,
      etag,
      uploaded,
      httpMetadata: { contentType },
      customMetadata,
      async arrayBuffer() {
        const copy = new Uint8Array(data.byteLength);
        copy.set(data);
        return copy.buffer as ArrayBuffer;
      },
      async text() {
        return new TextDecoder().decode(data);
      },
      async json<T = unknown>() {
        return JSON.parse(new TextDecoder().decode(data)) as T;
      },
      async blob() {
        return new Blob([data as unknown as BlobPart], { type: contentType });
      },
    };
  }

  async delete(keys: string | string[]): Promise<void> {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    for (const k of keyArray) {
      this.store.delete(k);
    }
  }

  async head(key: string): Promise<R2ObjectHeaderLike | null> {
    const item = this.store.get(key);
    if (!item) return null;
    return {
      key,
      size: item.data.length,
      etag: item.etag,
      uploaded: item.uploaded,
      httpMetadata: { contentType: item.contentType },
      customMetadata: item.customMetadata,
    };
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

// Global default mock R2 storage instance for fallback testing
let defaultMockR2: MockR2Storage | null = null;

export function getDefaultMockStorage(): MockR2Storage {
  if (!defaultMockR2) {
    defaultMockR2 = new MockR2Storage();
  }
  return defaultMockR2;
}

export function clearDefaultMockStorage(): void {
  if (defaultMockR2) {
    defaultMockR2.clear();
  }
}

/**
 * Stores a receipt buffer or stream into Cloudflare R2 (or mock fallback).
 */
export async function putReceipt(
  bucket: R2BucketLike | undefined,
  key: string,
  data: ArrayBuffer | Uint8Array | ReadableStream | string | Blob,
  options?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  }
): Promise<ReceiptStorageResult> {
  const targetBucket = bucket || getDefaultMockStorage();
  const detectedContentType = options?.contentType || getMimeType(key) || 'application/octet-stream';

  const res = await targetBucket.put(key, data, {
    httpMetadata: { contentType: detectedContentType },
    customMetadata: options?.customMetadata,
  });

  if (!res) {
    throw new Error(`Failed to store receipt object with key ${key}`);
  }

  return {
    key: res.key,
    size: res.size,
    etag: res.etag,
    contentType: res.httpMetadata?.contentType || detectedContentType,
    uploaded: res.uploaded,
  };
}

/**
 * Retrieves a receipt object from Cloudflare R2 (or mock fallback).
 */
export async function getReceipt(
  bucket: R2BucketLike | undefined,
  key: string
): Promise<ReceiptObject | null> {
  const targetBucket = bucket || getDefaultMockStorage();
  const obj = await targetBucket.get(key);
  if (!obj) return null;

  const arrayBuffer = await obj.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const contentType = obj.httpMetadata?.contentType || getMimeType(key) || 'application/octet-stream';

  return {
    key: obj.key,
    size: obj.size,
    contentType,
    data,
    uploaded: obj.uploaded,
    customMetadata: obj.customMetadata,
    async arrayBuffer() {
      return arrayBuffer;
    },
    async text() {
      return new TextDecoder().decode(data);
    },
  };
}

/**
 * Deletes a receipt object from Cloudflare R2 (or mock fallback).
 */
export async function deleteReceipt(
  bucket: R2BucketLike | undefined,
  key: string
): Promise<boolean> {
  const targetBucket = bucket || getDefaultMockStorage();
  await targetBucket.delete(key);
  return true;
}
