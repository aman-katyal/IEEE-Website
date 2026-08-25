/**
 * String Truncation and Slugification Utilities
 */

export function truncateWords(text: string, maxChars: number, suffix = '...'): string {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxChars) return text;

  const sub = text.slice(0, maxChars);
  const lastSpace = sub.lastIndexOf(' ');

  if (lastSpace > 0) {
    return sub.slice(0, lastSpace).trim() + suffix;
  }
  return sub.trim() + suffix;
}

export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
