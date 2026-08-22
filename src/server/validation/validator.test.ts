import { describe, it, expect } from 'vitest';
import { validateRequestBody, type SchemaDefinition } from './validator';

describe('validateRequestBody', () => {
  const purchaseSchema: SchemaDefinition = {
    requesterName: { type: 'string', required: true, min: 2, max: 50 },
    purdueEmail: { type: 'string', required: true, pattern: /^.+@purdue\.edu$/i },
    totalAmount: { type: 'number', required: true, min: 0.01, max: 10000 },
    committeeId: { type: 'string', required: true, enum: ['rov', 'racing', 'cs'] },
    receiptUrls: { type: 'array', required: false, max: 5 },
  };

  it('validates a correct request body successfully', () => {
    const validBody = {
      requesterName: 'Alex Boiler',
      purdueEmail: 'aboiler@purdue.edu',
      totalAmount: 150.75,
      committeeId: 'rov',
      receiptUrls: ['https://r2.purdueieee.org/receipt1.pdf'],
    };

    const result = validateRequestBody(validBody, purchaseSchema);
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual(validBody);
  });

  it('fails when required fields are missing', () => {
    const result = validateRequestBody({}, purchaseSchema);
    expect(result.success).toBe(false);
    expect(result.errors?.length).toBe(4);
  });

  it('validates regex patterns and min/max constraints', () => {
    const invalidBody = {
      requesterName: 'A', // too short (<2)
      purdueEmail: 'not-a-purdue-email@gmail.com', // invalid email pattern
      totalAmount: -10, // negative (<0.01)
      committeeId: 'invalid_committee', // not in enum
    };

    const result = validateRequestBody(invalidBody, purchaseSchema);
    expect(result.success).toBe(false);
    expect(result.errors?.some((e) => e.field === 'requesterName')).toBe(true);
    expect(result.errors?.some((e) => e.field === 'purdueEmail')).toBe(true);
    expect(result.errors?.some((e) => e.field === 'totalAmount')).toBe(true);
    expect(result.errors?.some((e) => e.field === 'committeeId')).toBe(true);
  });

  it('rejects non-object bodies', () => {
    expect(validateRequestBody(null, purchaseSchema).success).toBe(false);
    expect(validateRequestBody('string', purchaseSchema).success).toBe(false);
    expect(validateRequestBody([1, 2, 3], purchaseSchema).success).toBe(false);
  });
});
