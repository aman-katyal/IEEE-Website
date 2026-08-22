import { describe, it, expect } from 'vitest';
import { generateVoucherHash, verifyVoucherHash, type VoucherPayload } from './cryptoUtils';

describe('cryptoUtils Voucher Integrity Suite', () => {
  const sampleVoucher: VoucherPayload = {
    transactionId: 'TX-2026-ROV-001',
    committeeId: 'rov',
    payeeName: 'Alex Boiler',
    amountCents: 15000, // $150.00
    approvedAt: '2026-03-01T14:30:00Z',
    approverEmail: 'treasurer@purdueieee.org',
    receiptUrl: 'https://r2.purdueieee.org/receipts/tx-001.pdf',
  };

  it('generates deterministic SHA-256 hexadecimal hash', async () => {
    const hash1 = await generateVoucherHash(sampleVoucher);
    const hash2 = await generateVoucherHash(sampleVoucher);

    expect(hash1).toHaveLength(64);
    expect(hash1).toBe(hash2);
  });

  it('verifies valid voucher correctly', async () => {
    const hash = await generateVoucherHash(sampleVoucher);
    const isValid = await verifyVoucherHash(sampleVoucher, hash);
    expect(isValid).toBe(true);
  });

  it('detects tampering in amount or payee name', async () => {
    const originalHash = await generateVoucherHash(sampleVoucher);

    // Tampered amount ($150.00 -> $500.00)
    const tamperedAmount = { ...sampleVoucher, amountCents: 50000 };
    expect(await verifyVoucherHash(tamperedAmount, originalHash)).toBe(false);

    // Tampered payee
    const tamperedPayee = { ...sampleVoucher, payeeName: 'Malicious Actor' };
    expect(await verifyVoucherHash(tamperedPayee, originalHash)).toBe(false);
  });
});
