/**
 * Generic Pagination and Date-Range Filtering Utilities.
 */

export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10
): PaginationResult<T> {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (safePage - 1) * safePageSize;
  const data = items.slice(startIndex, startIndex + safePageSize);

  return {
    data,
    currentPage: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
}

export function filterByDateRange<T>(
  items: T[],
  dateSelector: (item: T) => string | Date | undefined | null,
  startDate?: string | Date | null,
  endDate?: string | Date | null
): T[] {
  const startMs = startDate ? new Date(startDate).getTime() : -Infinity;
  const endMs = endDate ? new Date(endDate).getTime() : Infinity;

  return items.filter((item) => {
    const rawDate = dateSelector(item);
    if (!rawDate) return false;
    const itemMs = new Date(rawDate).getTime();
    if (isNaN(itemMs)) return false;
    return itemMs >= startMs && itemMs <= endMs;
  });
}
