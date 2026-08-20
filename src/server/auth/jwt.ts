/**
 * WebCrypto HMAC-SHA256 JWT implementation for BoilerBooks 3.0 session management.
 * Runs universally in Node.js, Vitest, and Cloudflare Workers runtime.
 */

import type { AuthSession } from './types';

const DEFAULT_EXPIRATION_SECONDS = 86400; // 24 hours

/**
 * Encodes a string or Uint8Array to a URL-safe Base64 string without padding.
 */
export function base64UrlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes a URL-safe Base64 string into a Uint8Array.
 */
export function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes a URL-safe Base64 string into a UTF-8 string.
 */
export function base64UrlDecodeToString(str: string): string {
  const bytes = base64UrlDecode(str);
  return new TextDecoder().decode(bytes);
}

/**
 * Signs a session object into a standard HS256 JWT token using WebCrypto.
 */
export async function signSessionToken(
  session: Omit<AuthSession, 'exp' | 'iat'>,
  secret: string,
  expiresInSeconds = DEFAULT_EXPIRATION_SECONDS
): Promise<string> {
  if (!secret) {
    throw new Error('JWT secret key must not be empty');
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;

  const fullSession: AuthSession = {
    ...session,
    iat,
    exp,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullSession));
  const message = `${encodedHeader}.${encodedPayload}`;

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message)
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${message}.${encodedSignature}`;
}

/**
 * Verifies a JWT token with WebCrypto HMAC-SHA256 and returns the session if valid and not expired.
 */
export async function verifySessionToken(
  token: string,
  secret: string
): Promise<AuthSession | null> {
  if (!token || !secret || typeof token !== 'string' || typeof secret !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  try {
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const message = `${encodedHeader}.${encodedPayload}`;
    const signatureBytes = base64UrlDecode(encodedSignature);

    const isValidSignature = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      new TextEncoder().encode(message)
    );

    if (!isValidSignature) {
      return null;
    }

    const headerJson = base64UrlDecodeToString(encodedHeader);
    const header = JSON.parse(headerJson);
    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
      return null;
    }

    const payloadJson = base64UrlDecodeToString(encodedPayload);
    const session = JSON.parse(payloadJson) as AuthSession;

    const now = Math.floor(Date.now() / 1000);
    if (typeof session.exp !== 'number' || session.exp <= now) {
      return null;
    }

    if (!session.committeeId || !session.role || typeof session.isAdmin !== 'boolean') {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
