import { describe, it, expect, vi } from 'vitest';

// Mock Sanity
vi.mock('sanity', () => ({
  defineType: (config: any) => config,
  defineField: (config: any) => config,
}));

import { leader } from './leader';

describe('Leader Schema', () => {
  it('should have a category field', () => {
    const categoryField = leader.fields.find((f: any) => f.name === 'category');
    expect(categoryField).toBeDefined();
    expect(categoryField.type).toBe('string');
    expect(categoryField.options.list).toBeDefined();
  });
});
