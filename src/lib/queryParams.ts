/**
 * Safe Query Parameter Parser and Serializer
 */

export function parseQueryParams(search: string): Record<string, string> {
  if (!search || typeof search !== 'string') return {};
  const query = search.startsWith('?') ? search.slice(1) : search;
  if (!query) return {};

  const params = new URLSearchParams(query);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const str = searchParams.toString();
  return str ? `?${str}` : '';
}
