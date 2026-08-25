import { describe, it, expect } from 'vitest';
import { isValidEmail, isPurdueEmail } from './emailValidation';

describe('emailValidation', () => {
  it('validates standard email formats', () => {
    expect(isValidEmail('user@purdue.edu')).toBe(true);
    expect(isValidEmail('test.name+tag@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('verifies official Purdue career account emails', () => {
    expect(isPurdueEmail('president@purdue.edu')).toBe(true);
    expect(isPurdueEmail('treasurer@purdue.edu')).toBe(true);
    expect(isPurdueEmail('student@alumni.purdue.edu')).toBe(false);
    expect(isPurdueEmail('student@purdue.edu.fake')).toBe(false);
    expect(isPurdueEmail('user@gmail.com')).toBe(false);
  });
});
