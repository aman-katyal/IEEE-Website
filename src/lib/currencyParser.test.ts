import { describe, it, expect } from 'vitest';
import { parseCurrencyInput, formatCurrencyInput } from './currencyParser';

describe('currencyParser', () => {
  it('parses raw formatted currency strings correctly into numbers', () => {
    expect(parseCurrencyInput('$1,234.50')).toBe(1234.5);
    expect(parseCurrencyInput('  $ 500  ')).toBe(500);
    expect(parseCurrencyInput('-$25.99')).toBe(-25.99);
    expect(parseCurrencyInput('invalid')).toBe(0);
    expect(parseCurrencyInput('')).toBe(0);
    expect(parseCurrencyInput(75.5)).toBe(75.5);
  });

  it('formats numeric values into standard USD input masks', () => {
    expect(formatCurrencyInput(1234.5)).toBe('$1,234.50');
    expect(formatCurrencyInput(0)).toBe('$0.00');
  });
});
