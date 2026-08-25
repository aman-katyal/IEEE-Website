/**
 * Converts a dollar amount to exact integer cents.
 */
export function dollarsToCents(dollars: number): number {
  if (!Number.isFinite(dollars)) return 0;
  return Math.round((dollars + Number.EPSILON) * 100);
}

/**
 * Converts integer cents back to dollars.
 */
export function centsToDollars(cents: number): number {
  if (!Number.isFinite(cents)) return 0;
  return cents / 100;
}

/**
 * Formats a number as USD currency using Intl.NumberFormat.
 * Supports options for decimal precision and passing values directly in cents.
 */
export function formatCurrencyUSD(
  amount: number,
  optionsOrDecimals?: number | { decimals?: number; inCents?: boolean }
): string {
  let decimals = 2;
  let inCents = false;

  if (typeof optionsOrDecimals === 'number') {
    decimals = optionsOrDecimals;
  } else if (optionsOrDecimals) {
    decimals = optionsOrDecimals.decimals ?? 2;
    inCents = optionsOrDecimals.inCents ?? false;
  }

  const value = inCents ? centsToDollars(amount) : amount;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a 10-digit US phone number string as (XXX) XXX-XXXX.
 * Non-standard formats are returned as-is.
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

/**
 * Converts a US phone number into international E.164 standard (+17654946724) for tel: hyperlinks.
 */
export function toE164Phone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  if (digits.length > 0) {
    return `+${digits}`;
  }
  return '';
}

