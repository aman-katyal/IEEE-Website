import type { D1DatabaseLike } from '../db/adapter';
import type { DatabaseSync } from 'node:sqlite';
import { queryOne, executeQuery } from '../db/query';
import { verifyPin as verifyPinHash, hashPin } from './crypto';
import { signSessionToken } from './jwt';
import type { AuthSession, AuthRole } from './types';

export interface VerifyPinResult {
  authenticated: boolean;
  message?: string;
  session?: {
    role: 'TREASURER' | 'COMMITTEE_LEAD';
    committeeId: string;
    committeeName: string;
    name: string;
    email: string;
    token?: string;
  };
}

/**
 * Verifies a candidate PIN passcode against the D1 finance_committees roster.
 */
export async function verifyPin(
  dbLike: D1DatabaseLike | DatabaseSync,
  pin: string,
  role: 'treasurer' | 'committee',
  committeeId?: string
): Promise<VerifyPinResult> {
  if (!pin || typeof pin !== 'string') {
    return { authenticated: false, message: 'PIN passcode is required.' };
  }

  const targetId = role === 'treasurer' ? 'treasurer' : (committeeId || 'general');

  const row = await queryOne<{
    id: string;
    name: string;
    passcode_hash: string;
    is_admin: number;
    contact_email: string;
  }>(
    dbLike,
    'SELECT id, name, passcode_hash, is_admin, contact_email FROM finance_committees WHERE id = ?',
    [targetId]
  );

  if (!row) {
    return { authenticated: false, message: 'Invalid committee or authentication role.' };
  }

  let isValid = false;
  if (row.passcode_hash.startsWith('pbkdf2:')) {
    isValid = await verifyPinHash(pin.trim(), row.passcode_hash);
  } else {
    // Fallback comparison for plain-text passcodes
    isValid = pin.trim() === row.passcode_hash.trim();
  }

  if (!isValid) {
    return { authenticated: false, message: 'Invalid authentication passcode. Please check your credentials.' };
  }

  const authRole: AuthRole = row.is_admin === 1 ? 'TREASURER' : 'COMMITTEE_LEAD';
  const token = await signSessionToken({
    role: authRole,
    committeeId: row.id,
    name: row.is_admin === 1 ? 'Executive Treasurer' : `${row.name} Lead`,
    isAdmin: row.is_admin === 1,
  });

  return {
    authenticated: true,
    session: {
      role: authRole,
      committeeId: row.id,
      committeeName: row.name,
      name: row.is_admin === 1 ? 'Purdue IEEE Treasurer' : `${row.name} Leadership`,
      email: row.contact_email || `${row.id}@purdueieee.org`,
      token,
    },
  };
}

/**
 * Updates a committee's authentication passcode with PBKDF2-SHA256 hashing.
 */
export async function updateCommitteePasscode(
  dbLike: D1DatabaseLike | DatabaseSync,
  committeeId: string,
  newPasscode: string
): Promise<boolean> {
  const hash = await hashPin(newPasscode);
  const result = await executeQuery(
    dbLike,
    'UPDATE finance_committees SET passcode_hash = ? WHERE id = ?',
    [hash, committeeId]
  );
  return result.changes > 0;
}
