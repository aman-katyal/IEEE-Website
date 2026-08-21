import { describe, it, expect, vi } from 'vitest';

// Mock Sanity
vi.mock('sanity', () => ({
  defineType: (config: any) => config,
  defineField: (config: any) => config,
}));

import { leader } from './leader';
import { committee } from './committee';

describe('Sanity Schema Validations', () => {
  it('should have required validation on leader role and category fields', () => {
    const categoryField = leader.fields.find((f: any) => f.name === 'category');
    expect(categoryField).toBeDefined();
    expect(categoryField.type).toBe('string');
    expect(categoryField.validation).toBeDefined();

    const roleField = leader.fields.find((f: any) => f.name === 'role');
    expect(roleField).toBeDefined();
    expect(roleField.validation).toBeDefined();

    const nameField = leader.fields.find((f: any) => f.name === 'name');
    expect(nameField).toBeDefined();
    expect(nameField.validation).toBeDefined();
  });

  it('should have required validation on committee shortName and description', () => {
    const shortNameField = committee.fields.find((f: any) => f.name === 'shortName');
    expect(shortNameField).toBeDefined();
    expect(shortNameField.validation).toBeDefined();

    const descField = committee.fields.find((f: any) => f.name === 'description');
    expect(descField).toBeDefined();
    expect(descField.validation).toBeDefined();
  });
});
