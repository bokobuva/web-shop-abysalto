import type { Product } from "@/app/shared/types";
import { PRICE_RANGES, type PriceRangeId } from "@/app/shared/types";

export function filterByCategory(
  product: Product,
  categorySlug: string | null,
): boolean {
  if (!categorySlug) return true;
  return product.category === categorySlug;
}

export function filterByPriceRange(
  product: Product,
  priceRangeId: PriceRangeId | null,
): boolean {
  if (!priceRangeId) return true;
  const range = PRICE_RANGES.find((r) => r.id === priceRangeId);
  if (!range) return true;
  if (range.max === Infinity) return product.price >= range.min;
  return product.price >= range.min && product.price < range.max;
}

export function filterProducts(
  products: Product[],
  categorySlug: string | null,
  priceRangeId: PriceRangeId | null,
): Product[] {
  return products.filter(
    (p) =>
      filterByCategory(p, categorySlug) && filterByPriceRange(p, priceRangeId),
  );
}
