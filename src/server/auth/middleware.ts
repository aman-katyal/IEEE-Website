/**
 * BoilerBooks 3.0 Authentication & Authorization Middleware.
 * Parses HTTP-only cookies and Authorization headers to authenticate and authorize requests.
 */

import { verifySessionToken } from './jwt';
import type { AuthRole, AuthSession } from './types';

export const SESSION_COOKIE_NAME = 'finance_session';

/**
 * Parses a standard Cookie header into a key-value map.
 */
export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  const cookies: Record<string, string> = {};
  const pairs = cookieHeader.split(';');

  for (const pair of pairs) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const index = trimmed.indexOf('=');
    if (index !== -1) {
      const key = trimmed.substring(0, index).trim();
      const val = trimmed.substring(index + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  }

  return cookies;
}

/**
 * Extracts a session JWT token from standard request headers.
 * Looks first for `Authorization: Bearer <token>`, falling back to the `finance_session` cookie.
 */
export function extractTokenFromRequest(request: Request): string | null {
  // 1. Authorization: Bearer <token>
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // 2. Cookie header: finance_session=<token>
  const cookieHeader = request.headers.get('Cookie') || request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = parseCookies(cookieHeader);
    if (cookies[SESSION_COOKIE_NAME]) {
      return cookies[SESSION_COOKIE_NAME];
    }
  }

  return null;
}

/**
 * Authenticates an incoming Request by verifying its JWT against the provided secret.
 */
export async function authenticateRequest(
  request: Request,
  secret: string
): Promise<AuthSession | null> {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return verifySessionToken(token, secret);
}

/**
 * Checks if an authenticated session has an authorized role.
 */
export function requireRole(
  session: AuthSession | null,
  allowedRoles: AuthRole[]
): boolean {
  if (!session || !session.role) {
    return false;
  }

  return allowedRoles.includes(session.role);
}

/**
 * Creates a Set-Cookie header value for the session JWT.
 */
export function createSessionCookie(token: string, maxAgeSeconds = 86400): string {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}; Secure`;
}

/**
 * Creates a Set-Cookie header value to clear the session.
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}
