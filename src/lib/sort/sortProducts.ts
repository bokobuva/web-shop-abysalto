import type { Product } from "@/app/shared/types";
import type { SortOptionId } from "@/app/shared/types";

export function sortProducts(
  products: Product[],
  sortOptionId: SortOptionId,
): Product[] {
  if (sortOptionId === "default") return products;

  const sorted = products.slice();
  switch (sortOptionId) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return products;
  }
}
