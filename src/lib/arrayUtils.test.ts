import { describe, it, expect } from 'vitest';
import {
  chunkArray,
  uniqueBy,
  groupBy,
  shuffleArray,
  sampleArray,
} from './arrayUtils';

describe('arrayUtils', () => {
  it('chunks array into subarrays of specified size', () => {
    const list = [1, 2, 3, 4, 5, 6, 7];
    expect(chunkArray(list, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    expect(chunkArray([], 2)).toEqual([]);
    expect(chunkArray(list, 0)).toEqual([]);
  });

  it('deduplicates items based on key function', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Duplicate' },
    ];
    const unique = uniqueBy(items, (x) => x.id);
    expect(unique).toHaveLength(2);
    expect(unique[0].name).toBe('Alice');
    expect(unique[1].name).toBe('Bob');
  });

  it('groups array items into record object', () => {
    const committeeList = [
      { name: 'ROV', tier: 'technical' },
      { name: 'AESS', tier: 'technical' },
      { name: 'Social', tier: 'operational' },
    ];
    const grouped = groupBy(committeeList, (c) => c.tier);
    expect(grouped.technical).toHaveLength(2);
    expect(grouped.operational).toHaveLength(1);
  });

  it('shuffles and samples arrays without modifying length incorrectly', () => {
    const items = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(items);
    expect(shuffled).toHaveLength(5);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);

    const sample = sampleArray(items, 3);
    expect(sample).toHaveLength(3);
  });
});
