import type { Product } from "@/app/shared/types";

/**
 * Filters products by name matching the search query (case-insensitive, partial match).
 * Trims the query; returns all products when query is empty. Returns undefined when products is undefined.
 */
export function searchProducts(
  products: Product[] | undefined,
  searchQuery: string,
): Product[] | undefined {
  if (products === undefined) return undefined;
  const trimmedSearchQuery = searchQuery.trim();
  if (trimmedSearchQuery === "") return products;
  const lowerCaseSearchQuery = trimmedSearchQuery.toLowerCase();
  return products.filter((product) =>
    product.name.toLowerCase().includes(lowerCaseSearchQuery),
  );
}
