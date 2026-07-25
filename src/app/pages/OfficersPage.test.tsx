import { describe, it, expect } from 'vitest';
import { getOrderedLeaders } from './OfficersPage';
import { Leader } from '../../data/leadership';

describe('Officers Grouping Logic (getOrderedLeaders)', () => {
  const mockLeaders: Leader[] = [
    { _id: '1', name: 'Alice', role: 'President', email: 'alice@example.com' },
    { _id: '2', name: 'Bob', role: 'ROV Chair', email: 'bob@example.com' },
    { _id: '3', name: 'Charlie', role: 'Head of Infrastructure', email: 'charlie@example.com' },
    { _id: '4', name: 'Diana', role: 'Event Coordinator', email: 'diana@example.com' }, // Default fallback to member
    { _id: '5', name: 'Eve', role: 'General Member', email: 'eve@example.com', category: 'executive' }, // Explicit category overrides role
  ];

  it('should group officers by explicit category', () => {
    // Eve has role 'General Member' but explicit category 'executive'
    const executives = getOrderedLeaders(mockLeaders, null, 'executive');
    expect(executives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Alice' }),
        expect.objectContaining({ name: 'Eve' }),
      ])
    );
    expect(executives).toHaveLength(2);
  });

  it('should group officers by inferred role (executive)', () => {
    const executives = getOrderedLeaders(mockLeaders, null, 'executive');
    expect(executives.some(l => l.name === 'Alice')).toBe(true);
  });

  it('should group officers by inferred role (technical)', () => {
    const technical = getOrderedLeaders(mockLeaders, null, 'technical');
    expect(technical).toEqual([
      expect.objectContaining({ name: 'Bob' }),
    ]);
  });

  it('should group officers by inferred role (operations)', () => {
    const operations = getOrderedLeaders(mockLeaders, null, 'operations');
    expect(operations).toEqual([
      expect.objectContaining({ name: 'Charlie' }),
    ]);
  });

  it('should fallback to member category if role does not match known patterns', () => {
    const members = getOrderedLeaders(mockLeaders, null, 'member');
    expect(members).toEqual([
      expect.objectContaining({ name: 'Diana' }),
    ]);
  });

  it('should order officers based on config', () => {
    const config = {
      executiveOrder: [{ _id: '5' }, { _id: '1' }] // Expect Eve first, then Alice
    };

    const executives = getOrderedLeaders(mockLeaders, config, 'executive');
    expect(executives).toHaveLength(2);
    expect(executives[0].name).toBe('Eve');
    expect(executives[1].name).toBe('Alice');
  });

  it('should append unordered officers to the end', () => {
    const mockLeadersUnordered: Leader[] = [
      { _id: '1', name: 'Alice', role: 'President', email: 'alice@example.com' },
      { _id: '2', name: 'Bob', role: 'Vice President', email: 'bob@example.com' },
      { _id: '3', name: 'Charlie', role: 'Secretary', email: 'charlie@example.com' },
    ];

    const config = {
      executiveOrder: [{ _id: '3' }, { _id: '1' }] // Charlie, then Alice. Bob is unordered.
    };

    const executives = getOrderedLeaders(mockLeadersUnordered, config, 'executive');
    expect(executives).toHaveLength(3);
    expect(executives[0].name).toBe('Charlie');
    expect(executives[1].name).toBe('Alice');
    expect(executives[2].name).toBe('Bob');
  });

  it('should return un-ordered array if config array is empty or undefined', () => {
    const config1 = { executiveOrder: [] };
    const executives1 = getOrderedLeaders(mockLeaders, config1, 'executive');
    // Order should remain the same as mockLeaders
    expect(executives1[0].name).toBe('Alice');
    expect(executives1[1].name).toBe('Eve');

    const config2 = {}; // Missing executiveOrder
    const executives2 = getOrderedLeaders(mockLeaders, config2, 'executive');
    expect(executives2[0].name).toBe('Alice');
    expect(executives2[1].name).toBe('Eve');
  });
});
