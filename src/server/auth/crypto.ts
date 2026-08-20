/**
 * Cryptographic PIN hashing and verification using WebCrypto PBKDF2.
 * Compatible with Node.js, Vitest, Cloudflare Workers, and modern browsers without native C++ bindings.
 */

const DEFAULT_ITERATIONS = 100000;
const KEY_LENGTH_BITS = 256; // 32 bytes
const SALT_LENGTH_BYTES = 16;

/**
 * Converts a Uint8Array buffer into a lowercase hex string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Converts a hex string into a Uint8Array buffer.
 */
export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string length');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substring(i, i + 2), 16);
    if (isNaN(byte)) {
      throw new Error('Invalid hex characters');
    }
    bytes[i / 2] = byte;
  }
  return bytes;
}

/**
 * Performs a constant-time comparison of two Uint8Arrays to prevent timing attacks.
 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Generates cryptographically secure random bytes for salting.
 */
export function generateSalt(length = SALT_LENGTH_BYTES): Uint8Array {
  const salt = new Uint8Array(length);
  globalThis.crypto.getRandomValues(salt);
  return salt;
}

/**
 * Hashes a PIN passcode using WebCrypto PBKDF2-SHA256.
 * Returns a serialized hash string formatted as: `pbkdf2:sha256:<iterations>:<saltHex>:<hashHex>`
 */
export async function hashPin(pin: string, iterations = DEFAULT_ITERATIONS): Promise<string> {
  if (!pin || typeof pin !== 'string') {
    throw new Error('PIN must be a non-empty string');
  }

  const salt = generateSalt(SALT_LENGTH_BYTES);
  const encoder = new TextEncoder();
  const pinBuffer = encoder.encode(pin);

  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    pinBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH_BITS
  );

  const hashBytes = new Uint8Array(derivedBits);
  const saltHex = bytesToHex(salt);
  const hashHex = bytesToHex(hashBytes);

  return `pbkdf2:sha256:${iterations}:${saltHex}:${hashHex}`;
}

/**
 * Verifies a candidate PIN against a stored PBKDF2 hash string.
 */
export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  if (!pin || !storedHash || typeof pin !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  try {
    const parts = storedHash.split(':');
    if (parts.length !== 5 || parts[0] !== 'pbkdf2' || parts[1] !== 'sha256') {
      return false;
    }

    const iterations = parseInt(parts[2], 10);
    if (isNaN(iterations) || iterations <= 0) {
      return false;
    }

    const salt = hexToBytes(parts[3]);
    const expectedHashBytes = hexToBytes(parts[4]);

    const encoder = new TextEncoder();
    const pinBuffer = encoder.encode(pin);

    const keyMaterial = await globalThis.crypto.subtle.importKey(
      'raw',
      pinBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await globalThis.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as unknown as BufferSource,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      KEY_LENGTH_BITS
    );

    const computedHashBytes = new Uint8Array(derivedBits);
    return timingSafeEqual(computedHashBytes, expectedHashBytes);
  } catch {
    return false;
  }
}
