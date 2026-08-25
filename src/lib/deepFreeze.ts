/**
 * Deep Freeze Utility
 * Recursively freezes objects and arrays to guarantee immutability for constants.
 */

export function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj as Readonly<T>;
  }

  const propNames = Object.getOwnPropertyNames(obj);

  for (const name of propNames) {
    const value = (obj as Record<string, unknown>)[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj) as Readonly<T>;
}
