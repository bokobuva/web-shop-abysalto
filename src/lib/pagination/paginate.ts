/**
 * Slices items into a page by index (page - 1) * pageSize.
 * Returns undefined when items is undefined; returns empty array when page is out of range.
 */
export function paginate<T>(
  items: T[] | undefined,
  page: number,
  pageSize: number,
): T[] | undefined {
  if (items === undefined) return undefined;
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
