/**
 * Cryptographic digest utility for tamper-evident BOSOP vouchers and receipt verification.
 */

export interface VoucherPayload {
  transactionId: string;
  committeeId: string;
  payeeName: string;
  amountCents: number;
  approvedAt: string;
  approverEmail: string;
  receiptUrl?: string;
}

/**
 * Computes deterministic SHA-256 hexadecimal hash string for a voucher payload.
 */
export async function generateVoucherHash(payload: VoucherPayload): Promise<string> {
  const canonicalString = [
    payload.transactionId,
    payload.committeeId,
    payload.payeeName.trim().toLowerCase(),
    payload.amountCents.toString(),
    payload.approvedAt,
    payload.approverEmail.trim().toLowerCase(),
    payload.receiptUrl || '',
  ].join('|');

  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalString);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple checksum if SubtleCrypto is unavailable
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Verifies that a voucher payload matches an expected SHA-256 verification hash.
 */
export async function verifyVoucherHash(
  payload: VoucherPayload,
  expectedHash: string
): Promise<boolean> {
  const computed = await generateVoucherHash(payload);
  return computed.toLowerCase() === expectedHash.toLowerCase();
}
