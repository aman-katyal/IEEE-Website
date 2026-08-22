/**
 * Generic Object.groupBy / Grouping Utility for collections.
 */

export function groupBy<T, K extends string | number | symbol>(
  items: readonly T[],
  keySelector: (item: T, index: number) => K
): Record<K, T[]> {
  if (typeof (Object as any).groupBy === "function") {
    return (Object as any).groupBy(items, keySelector) as Record<K, T[]>;
  }

  const result = {} as Record<K, T[]>;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = keySelector(item, i);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}
