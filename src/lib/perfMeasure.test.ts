import { describe, it, expect } from 'vitest';
import { markStart, markEnd } from './perfMeasure';

describe('perfMeasure', () => {
  it('safely marks start and end of a measure without throwing', () => {
    markStart('render-test');
    const duration = markEnd('render-test');
    expect(typeof duration === 'number' || duration === null).toBe(true);
  });
});
