/**
 * Sorts an array of objects by a string or number key using localeCompare for strings.
 */
export function sortByKey<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === 'asc' ? 1 : -1;
    if (bVal == null) return direction === 'asc' ? -1 : 1;
    let result: number;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      result = aVal - bVal;
    } else {
      result = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
    }
    return direction === 'asc' ? result : -result;
  });
}
