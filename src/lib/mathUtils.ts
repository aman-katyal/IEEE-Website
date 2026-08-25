/**
 * Returns a percentage of value relative to total.
 * @param value - numerator
 * @param total - denominator (returns 0 if 0 or negative)
 * @param options.clamp - clamp result to [0, 100] (default: true)
 * @param options.decimals - decimal places (default: 0)
 */
export function calculatePercentage(
  value: number,
  total: number,
  options?: { clamp?: boolean; decimals?: number }
): number {
  const { clamp = true, decimals = 0 } = options ?? {};
  if (!total || total <= 0) return 0;
  const raw = (value / total) * 100;
  const clamped = clamp ? Math.min(100, Math.max(0, raw)) : raw;
  const factor = Math.pow(10, decimals);
  return Math.round(clamped * factor) / factor;
}

export function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function sumCurrencies(amounts: number[]): number {
  const sumInCents = amounts.reduce((acc, curr) => acc + Math.round(curr * 100), 0);
  return sumInCents / 100;
}

export function diffCurrencies(a: number, b: number): number {
  return (Math.round(a * 100) - Math.round(b * 100)) / 100;
}

