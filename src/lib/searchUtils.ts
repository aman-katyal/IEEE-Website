/**
 * Text Search Scoring and Fuzzy Match Helpers
 */

export function fuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  if (t === q) return 1.0;
  if (t.startsWith(q)) return 0.9;
  if (t.includes(q)) return 0.7;

  // Check character subsequence match
  let score = 0;
  let qIdx = 0;

  for (let tIdx = 0; tIdx < t.length && qIdx < q.length; tIdx++) {
    if (t[tIdx] === q[qIdx]) {
      score += 1;
      qIdx++;
    }
  }

  if (qIdx === q.length) {
    return (score / t.length) * 0.5;
  }

  return 0;
}

export function filterByQuery<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string[]
): T[] {
  if (!query || !query.trim()) return items;

  const scored = items
    .map((item) => {
      const texts = getSearchableText(item);
      const maxScore = Math.max(...texts.map((text) => fuzzyScore(query, text)), 0);
      return { item, score: maxScore };
    })
    .filter((entry) => entry.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}
