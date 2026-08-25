/**
 * Array Batching, Deduplication, and Sampling Utilities
 */

export function chunkArray<T>(array: T[], size: number): T[][] {
  if (!array || array.length === 0 || size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function uniqueBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  if (!array) return [];
  const seen = new Set<K>();
  const result: T[] = [];
  for (const item of array) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (const item of array) {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sampleArray<T>(array: T[], count: number): T[] {
  if (!array || array.length === 0) return [];
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}
