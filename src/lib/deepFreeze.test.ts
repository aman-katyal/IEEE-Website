import { describe, it, expect } from 'vitest';
import { deepFreeze } from './deepFreeze';

describe('deepFreeze', () => {
  it('deeply freezes nested objects and arrays', () => {
    const config = {
      api: { url: 'https://purdueieee.org', retries: 3 },
      features: ['auth', 'matrix'],
    };

    const frozen = deepFreeze(config);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.api)).toBe(true);
    expect(Object.isFrozen(frozen.features)).toBe(true);

    expect(() => {
      // @ts-expect-error - verifying runtime throw on mutation in strict mode
      frozen.api.retries = 5;
    }).toThrow();
  });
});
