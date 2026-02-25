import { PRICE_RANGES } from "@/app/shared/constants";
import type { PriceRangeId, Product } from "@/app/shared/types";

/**
 * Returns true if the product matches the category filter.
 * Returns true when categorySlug is null (no filter).
 */
export function filterByCategory(
  product: Product,
  categorySlug: string | null,
): boolean {
  if (!categorySlug) return true;
  return product.category === categorySlug;
}

/**
 * Returns true if the product price falls within the given price range.
 * Uses PRICE_RANGES; returns true when priceRangeId is null or unknown.
 */
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

/**
 * Filters products by category and price range.
 * Returns undefined when products is undefined; otherwise returns filtered array.
 */
export function filterProducts(
  products: Product[] | undefined,
  categorySlug: string | null,
  priceRangeId: PriceRangeId | null,
): Product[] | undefined {
  if (products === undefined) return undefined;
  return products.filter(
    (p) =>
      filterByCategory(p, categorySlug) && filterByPriceRange(p, priceRangeId),
  );
}
