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

  it('should have required validation and character limits on committee fields', () => {
    const shortNameField = committee.fields.find((f: any) => f.name === 'shortName');
    expect(shortNameField).toBeDefined();
    expect(shortNameField.validation).toBeDefined();

    const descField = committee.fields.find((f: any) => f.name === 'description');
    expect(descField).toBeDefined();
    expect(descField.validation).toBeDefined();

    const taglineField = committee.fields.find((f: any) => f.name === 'tagline');
    expect(taglineField).toBeDefined();
    expect(taglineField.validation).toBeDefined();

    const slugField = committee.fields.find((f: any) => f.name === 'id');
    expect(slugField).toBeDefined();
    expect(slugField.validation).toBeDefined();

    // Test slug custom validation function
    let customValidator: any = null;
    const mockRule: any = {
      required: () => mockRule,
      custom: (fn: any) => {
        customValidator = fn;
        return mockRule;
      },
    };
    slugField.validation(mockRule);
    expect(customValidator).toBeDefined();

    // Valid kebab-case slug
    expect(customValidator({ current: 'aerial-robotics' })).toBe(true);
    expect(customValidator({ current: 'rov' })).toBe(true);

    // Uppercase rejected
    expect(customValidator({ current: 'Aerial-Robotics' })).toBe('Slug must be all lowercase.');

    // Invalid characters rejected
    expect(customValidator({ current: 'aerial_robotics' })).toBe('Slug can only contain lowercase letters, numbers, and dashes.');

    // Leading/trailing dashes rejected
    expect(customValidator({ current: '-rov-' })).toBe('Slug cannot start or end with a dash.');
  });
});
