/**
 * Currency Input Parsing and Masking Utilities
 */

export function parseCurrencyInput(input: string | number): number {
  if (typeof input === 'number') {
    return isNaN(input) ? 0 : input;
  }
  if (!input || typeof input !== 'string') {
    return 0;
  }

  // Remove currency symbols, commas, spaces
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round((parsed + Number.EPSILON) * 100) / 100;
}

export function formatCurrencyInput(value: number): string {
  if (isNaN(value) || value === 0) return '$0.00';
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
