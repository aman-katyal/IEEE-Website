import { describe, it, expect } from 'vitest';
import { fuzzyScore, filterByQuery } from './searchUtils';

describe('searchUtils', () => {
  it('calculates fuzzy match scores accurately', () => {
    expect(fuzzyScore('rov', 'Remotely Operated Vehicles (ROV)')).toBeGreaterThan(0.5);
    expect(fuzzyScore('exact', 'exact')).toBe(1.0);
    expect(fuzzyScore('aero', 'Aerospace')).toBe(0.9);
    expect(fuzzyScore('xyz', 'Computer Society')).toBe(0);
  });

  it('filters and sorts items by query relevance', () => {
    const committees = [
      { name: 'Computer Society', desc: 'Software and systems' },
      { name: 'Remotely Operated Vehicles', desc: 'Underwater robotics' },
      { name: 'Aerial Robotics', desc: 'Drones and aerial systems' },
    ];

    const results = filterByQuery(committees, 'Aerial', (c) => [c.name, c.desc]);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Aerial Robotics');
  });
});
