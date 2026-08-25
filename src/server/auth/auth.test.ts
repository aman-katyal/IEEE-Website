import { describe, it, expect, vi } from 'vitest';
import {
  hashPin,
  verifyPin,
  bytesToHex,
  hexToBytes,
  timingSafeEqual,
  generateSalt,
} from './crypto';
import {
  signSessionToken,
  verifySessionToken,
  base64UrlEncode,
  base64UrlDecode,
  base64UrlDecodeToString,
} from './jwt';
import {
  authenticateRequest,
  requireRole,
  parseCookies,
  extractTokenFromRequest,
  createSessionCookie,
  clearSessionCookie,
  SESSION_COOKIE_NAME,
} from './middleware';
import { DatabaseSync } from 'node:sqlite';
import { verifyPin as verifyPinService, updateCommitteePasscode } from './service';
import type { AuthRole, AuthSession } from './types';

describe('BoilerBooks Auth: Crypto & PIN Verification', () => {
  it('should generate valid salt bytes of requested length', () => {
    const salt16 = generateSalt(16);
    expect(salt16).toBeInstanceOf(Uint8Array);
    expect(salt16.length).toBe(16);

    const salt32 = generateSalt(32);
    expect(salt32.length).toBe(32);
  });

  it('should correctly convert bytes to hex and back', () => {
    const original = new Uint8Array([0, 15, 255, 128, 42]);
    const hex = bytesToHex(original);
    expect(hex).toBe('000fff802a');

    const recovered = hexToBytes(hex);
    expect(recovered).toEqual(original);
  });

  it('should throw when decoding invalid hex strings', () => {
    expect(() => hexToBytes('123')).toThrow('Invalid hex string length');
    expect(() => hexToBytes('zz')).toThrow('Invalid hex characters');
  });

  it('should perform timing-safe array comparison', () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 3, 4]);
    const c = new Uint8Array([1, 2, 3, 5]);
    const d = new Uint8Array([1, 2, 3]);

    expect(timingSafeEqual(a, b)).toBe(true);
    expect(timingSafeEqual(a, c)).toBe(false);
    expect(timingSafeEqual(a, d)).toBe(false);
  });

  it('should hash a PIN passcode and verify valid PIN successfully', async () => {
    const pin = '482910';
    // Use lower iterations for fast unit test execution
    const hashed = await hashPin(pin, 1000);

    expect(hashed).toMatch(/^pbkdf2:sha256:1000:[0-9a-f]{32}:[0-9a-f]{64}$/);

    const isValid = await verifyPin(pin, hashed);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect PIN passcode', async () => {
    const pin = '123456';
    const wrongPin = '654321';
    const hashed = await hashPin(pin, 1000);

    const isValid = await verifyPin(wrongPin, hashed);
    expect(isValid).toBe(false);
  });

  it('should reject invalid or malformed hash strings', async () => {
    expect(await verifyPin('1234', '')).toBe(false);
    expect(await verifyPin('', 'pbkdf2:sha256:1000:abc:def')).toBe(false);
    expect(await verifyPin('1234', 'invalid:format')).toBe(false);
    expect(await verifyPin('1234', 'pbkdf2:md5:1000:abcd:ef01')).toBe(false);
    expect(await verifyPin('1234', 'pbkdf2:sha256:-1:abcd:ef01')).toBe(false);
    expect(await verifyPin('1234', 'pbkdf2:sha256:1000:invalidhex:deadbeef')).toBe(false);
  });

  it('should throw an error when hashing an empty or invalid PIN', async () => {
    // @ts-expect-error test invalid parameter
    await expect(hashPin('')).rejects.toThrow('PIN must be a non-empty string');
    // @ts-expect-error test invalid parameter
    await expect(hashPin(null)).rejects.toThrow('PIN must be a non-empty string');
  });
});

describe('BoilerBooks Auth: JWT WebCrypto Signing & Verification', () => {
  const testSecret = 'super-secret-treasury-signing-key-purdue-ieee-2026';
  const testSession: Omit<AuthSession, 'exp' | 'iat'> = {
    committeeId: 'rov',
    role: 'COMMITTEE_LEAD',
    name: 'Remotely Operated Vehicles',
    isAdmin: false,
  };

  it('should encode and decode base64url strings', () => {
    const raw = 'Hello Purdue IEEE! 🚀';
    const encoded = base64UrlEncode(raw);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');

    const decoded = base64UrlDecodeToString(encoded);
    expect(decoded).toBe(raw);
  });

  it('should sign and successfully verify a valid JWT session token', async () => {
    const token = await signSessionToken(testSession, testSecret, 3600);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const verified = await verifySessionToken(token, testSecret);
    expect(verified).not.toBeNull();
    expect(verified?.committeeId).toBe('rov');
    expect(verified?.role).toBe('COMMITTEE_LEAD');
    expect(verified?.name).toBe('Remotely Operated Vehicles');
    expect(verified?.isAdmin).toBe(false);
    expect(typeof verified?.iat).toBe('number');
    expect(typeof verified?.exp).toBe('number');
    expect(verified!.exp).toBeGreaterThan(verified!.iat);
  });

  it('should reject verification with an invalid secret key', async () => {
    const token = await signSessionToken(testSession, testSecret, 3600);
    const verified = await verifySessionToken(token, 'wrong-secret-key');
    expect(verified).toBeNull();
  });

  it('should reject a tampered payload or signature', async () => {
    const token = await signSessionToken(testSession, testSecret, 3600);
    const [header, payload, signature] = token.split('.');

    // Tamper payload
    const decodedPayload = JSON.parse(base64UrlDecodeToString(payload));
    decodedPayload.role = 'TREASURER';
    decodedPayload.isAdmin = true;
    const tamperedPayload = base64UrlEncode(JSON.stringify(decodedPayload));
    const tamperedToken = `${header}.${tamperedPayload}.${signature}`;

    const verified = await verifySessionToken(tamperedToken, testSecret);
    expect(verified).toBeNull();

    // Tamper signature
    const badSignatureToken = `${header}.${payload}.${signature.slice(0, -4)}AAAA`;
    expect(await verifySessionToken(badSignatureToken, testSecret)).toBeNull();
  });

  it('should reject expired session tokens', async () => {
    // Set expiration to negative seconds to simulate past token
    const expiredToken = await signSessionToken(testSession, testSecret, -10);
    const verified = await verifySessionToken(expiredToken, testSecret);
    expect(verified).toBeNull();
  });

  it('should reject malformed or non-string tokens', async () => {
    expect(await verifySessionToken('', testSecret)).toBeNull();
    expect(await verifySessionToken('invalid.token', testSecret)).toBeNull();
    expect(await verifySessionToken('a.b.c.d', testSecret)).toBeNull();
    // @ts-expect-error testing invalid parameter
    expect(await verifySessionToken(null, testSecret)).toBeNull();
    // @ts-expect-error testing invalid secret
    expect(await verifySessionToken('a.b.c', null)).toBeNull();
  });

  it('should throw an error when signing with an empty secret', async () => {
    await expect(signSessionToken(testSession, '')).rejects.toThrow(
      'JWT secret key must not be empty'
    );
  });
});

describe('BoilerBooks Auth: Middleware & RBAC', () => {
  const secret = 'treasurer-middleware-jwt-key';
  const committeeSession: Omit<AuthSession, 'exp' | 'iat'> = {
    committeeId: 'racing',
    role: 'COMMITTEE_LEAD',
    name: 'IEEE Racing',
    isAdmin: false,
  };
  const treasurerSession: Omit<AuthSession, 'exp' | 'iat'> = {
    committeeId: 'exec',
    role: 'TREASURER',
    name: 'Purdue IEEE Branch Treasurer',
    isAdmin: true,
  };

  it('should parse cookie strings accurately', () => {
    const cookieHeader = 'theme=dark; finance_session=my_jwt_token; other_pref=1';
    const parsed = parseCookies(cookieHeader);

    expect(parsed['theme']).toBe('dark');
    expect(parsed['finance_session']).toBe('my_jwt_token');
    expect(parsed['other_pref']).toBe('1');
    expect(parseCookies(null)).toEqual({});
    expect(parseCookies('')).toEqual({});
  });

  it('should extract token from Authorization Bearer header', () => {
    const req = new Request('https://purdueieee.org/api/finance/budget', {
      headers: {
        Authorization: 'Bearer auth_sample_jwt_token',
      },
    });

    const token = extractTokenFromRequest(req);
    expect(token).toBe('auth_sample_jwt_token');
  });

  it('should extract token from finance_session cookie if Authorization header is missing', () => {
    const req = new Request('https://purdueieee.org/api/finance/budget', {
      headers: {
        Cookie: 'session_id=123; finance_session=cookie_jwt_token',
      },
    });

    const token = extractTokenFromRequest(req);
    expect(token).toBe('cookie_jwt_token');
  });

  it('should return null if neither Authorization nor Cookie contains a token', () => {
    const req = new Request('https://purdueieee.org/api/finance/budget');
    expect(extractTokenFromRequest(req)).toBeNull();
  });

  it('should authenticate request with valid Bearer token', async () => {
    const token = await signSessionToken(committeeSession, secret);
    const req = new Request('https://purdueieee.org/api/finance/requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const session = await authenticateRequest(req, secret);
    expect(session).not.toBeNull();
    expect(session?.committeeId).toBe('racing');
    expect(session?.role).toBe('COMMITTEE_LEAD');
  });

  it('should authenticate request with valid cookie token', async () => {
    const token = await signSessionToken(treasurerSession, secret);
    const req = new Request('https://purdueieee.org/api/finance/budgets', {
      headers: {
        Cookie: `${SESSION_COOKIE_NAME}=${token}`,
      },
    });

    const session = await authenticateRequest(req, secret);
    expect(session).not.toBeNull();
    expect(session?.committeeId).toBe('exec');
    expect(session?.role).toBe('TREASURER');
    expect(session?.isAdmin).toBe(true);
  });

  it('should return null when authenticating with invalid token in request', async () => {
    const req = new Request('https://purdueieee.org/api/finance/requests', {
      headers: {
        Authorization: 'Bearer invalid.token.payload',
      },
    });

    const session = await authenticateRequest(req, secret);
    expect(session).toBeNull();
  });

  it('should generate proper Set-Cookie and Clear-Cookie strings', () => {
    const token = 'sample_token_value';
    const setCookie = createSessionCookie(token, 3600);
    expect(setCookie).toContain('finance_session=sample_token_value');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Max-Age=3600');
    expect(setCookie).toContain('SameSite=Lax');
    expect(setCookie).toContain('Secure');

    const clearCookie = clearSessionCookie();
    expect(clearCookie).toContain('finance_session=');
    expect(clearCookie).toContain('Max-Age=0');
  });

  it('should enforce role-based access control (RBAC)', () => {
    const mockLeadSession: AuthSession = {
      committeeId: 'aesc',
      role: 'COMMITTEE_LEAD',
      name: 'Aerospace Systems',
      isAdmin: false,
      exp: Date.now() + 10000,
      iat: Date.now(),
    };

    const mockTreasurerSession: AuthSession = {
      committeeId: 'exec',
      role: 'TREASURER',
      name: 'Purdue IEEE Treasurer',
      isAdmin: true,
      exp: Date.now() + 10000,
      iat: Date.now(),
    };

    const mockPresidentSession: AuthSession = {
      committeeId: 'exec',
      role: 'PRESIDENT',
      name: 'Purdue IEEE President',
      isAdmin: true,
      exp: Date.now() + 10000,
      iat: Date.now(),
    };

    const mockAdminSession: AuthSession = {
      committeeId: 'it',
      role: 'IT_ADMIN',
      name: 'IEEE IT Admin',
      isAdmin: true,
      exp: Date.now() + 10000,
      iat: Date.now(),
    };

    const treasurerOnlyRoles: AuthRole[] = ['TREASURER'];
    const executiveRoles: AuthRole[] = ['TREASURER', 'PRESIDENT'];
    const anyCommitteeRoles: AuthRole[] = ['COMMITTEE_LEAD', 'TREASURER', 'PRESIDENT'];

    // COMMITTEE_LEAD blocked from treasurer-only & executive actions
    expect(requireRole(mockLeadSession, treasurerOnlyRoles)).toBe(false);
    expect(requireRole(mockLeadSession, executiveRoles)).toBe(false);
    expect(requireRole(mockLeadSession, anyCommitteeRoles)).toBe(true);

    // TREASURER permitted on treasurer-only, exec, and committee actions
    expect(requireRole(mockTreasurerSession, treasurerOnlyRoles)).toBe(true);
    expect(requireRole(mockTreasurerSession, executiveRoles)).toBe(true);
    expect(requireRole(mockTreasurerSession, anyCommitteeRoles)).toBe(true);

    // PRESIDENT permitted on executive actions
    expect(requireRole(mockPresidentSession, treasurerOnlyRoles)).toBe(false);
    expect(requireRole(mockPresidentSession, executiveRoles)).toBe(true);

    // IT_ADMIN checks
    expect(requireRole(mockAdminSession, ['IT_ADMIN'])).toBe(true);
    expect(requireRole(mockAdminSession, treasurerOnlyRoles)).toBe(false);

    // Null session blocked from all actions
    expect(requireRole(null, treasurerOnlyRoles)).toBe(false);
    expect(requireRole(null, anyCommitteeRoles)).toBe(false);
  });

  describe('BoilerBooks Auth Service & Passcode Verification', () => {
    it('authenticates valid committee and treasurer passcodes from database', async () => {
      const db = new DatabaseSync(':memory:');
      db.exec(`
        CREATE TABLE finance_committees (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          passcode_hash TEXT NOT NULL,
          is_admin INTEGER NOT NULL DEFAULT 0,
          contact_email TEXT
        );
      `);

      const treasurerHash = await hashPin('TR-872R$565-3ED', 1000);
      const rovHash = await hashPin('ROV-CVJL$897-GLV', 1000);

      db.exec(`
        INSERT INTO finance_committees (id, name, passcode_hash, is_admin, contact_email)
        VALUES
          ('treasurer', 'Executive Treasurer', '${treasurerHash}', 1, 'treasurer@purdueieee.org'),
          ('rov', 'Remotely Operated underwater Vehicle (ROV)', '${rovHash}', 0, 'rov@purdueieee.org');
      `);

      // Verify valid treasurer password
      const trResult = await verifyPinService(db, 'TR-872R$565-3ED', 'treasurer');
      expect(trResult.authenticated).toBe(true);
      expect(trResult.session?.role).toBe('TREASURER');
      expect(trResult.session?.email).toBe('treasurer@purdueieee.org');

      // Verify valid committee lead password
      const rovResult = await verifyPinService(db, 'ROV-CVJL$897-GLV', 'committee', 'rov');
      expect(rovResult.authenticated).toBe(true);
      expect(rovResult.session?.role).toBe('COMMITTEE_LEAD');
      expect(rovResult.session?.committeeId).toBe('rov');

      // Reject invalid password
      const badResult = await verifyPinService(db, 'WrongPass123!', 'treasurer');
      expect(badResult.authenticated).toBe(false);
      expect(badResult.message).toContain('Invalid authentication passcode');

      // Test updating committee passcode
      const updated = await updateCommitteePasscode(db, 'rov', 'ROV-NewSecretPass#99');
      expect(updated).toBe(true);

      const newPassResult = await verifyPinService(db, 'ROV-NewSecretPass#99', 'committee', 'rov');
      expect(newPassResult.authenticated).toBe(true);

      db.close();
    });
  });
});
