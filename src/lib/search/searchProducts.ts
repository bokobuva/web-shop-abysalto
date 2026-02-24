import type { Product } from "@/app/shared/types";

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
