import { describe, it, expect } from 'vitest';
import { sortByKey } from './sortUtils';

describe('sortByKey', () => {
  const items = [
    { name: 'Charlie', age: 30 },
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 35 },
  ];

  it('sorts strings ascending', () => {
    const result = sortByKey(items, 'name', 'asc');
    expect(result.map(i => i.name)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('sorts strings descending', () => {
    const result = sortByKey(items, 'name', 'desc');
    expect(result.map(i => i.name)).toEqual(['Charlie', 'Bob', 'Alice']);
  });

  it('sorts numbers ascending', () => {
    const result = sortByKey(items, 'age', 'asc');
    expect(result.map(i => i.age)).toEqual([25, 30, 35]);
  });

  it('sorts numbers descending', () => {
    const result = sortByKey(items, 'age', 'desc');
    expect(result.map(i => i.age)).toEqual([35, 30, 25]);
  });

  it('places null values last in ascending order', () => {
    const data = [
      { name: 'B', score: null as number | null },
      { name: 'A', score: 1 },
    ];
    const result = sortByKey(data, 'score', 'asc');
    expect(result[result.length - 1].name).toBe('B');
  });

  it('places null values first in descending order', () => {
    const data = [
      { name: 'A', score: 1 },
      { name: 'B', score: null as number | null },
    ];
    const result = sortByKey(data, 'score', 'desc');
    expect(result[0].name).toBe('B');
  });

  it('does not mutate the original array', () => {
    const original = [...items];
    sortByKey(items, 'name', 'desc');
    expect(items).toEqual(original);
  });
});
