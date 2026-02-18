import type { Product } from "@/app/shared/types";

export function searchProducts(
  products: Product[] | undefined,
  searchQuery: string,
): Product[] | undefined {
  if (products === undefined) return undefined;
  const trimmed = searchQuery.trim();
  if (trimmed === "") return products;
  const lower = trimmed.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower));
}
