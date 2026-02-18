export function paginate<T>(
  items: T[] | undefined,
  page: number,
  pageSize: number,
): T[] | undefined {
  if (items === undefined) return undefined;
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
