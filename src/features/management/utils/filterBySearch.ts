export function filterBySearch<T extends { name: string }>(items: T[], search: string): T[] {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => item.name.toLowerCase().includes(query));
}
