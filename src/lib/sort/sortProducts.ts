import { SORT_OPTIONS } from "@/app/shared/constants";
import type { Product } from "@/app/shared/types";
import type { SortOptionId } from "@/app/shared/types";

function compareProductValues(
  valueA: string | number,
  valueB: string | number,
  order: "asc" | "desc",
): number {
  const isAscending = order === "asc";
  const comparison =
    typeof valueA === "number"
      ? valueA - (valueB as number)
      : (valueA as string).localeCompare(valueB as string);
  return isAscending ? comparison : -comparison;
}

/**
 * Sorts products by the given sort option (SORT_OPTIONS).
 * Returns products unchanged when sortOptionId is "default" or unknown.
 * Does not mutate the input array.
 */
export function sortProducts(
  products: Product[] | undefined,
  sortOptionId: SortOptionId,
): Product[] | undefined {
  if (products === undefined) return undefined;
  if (sortOptionId === "default") return products;

  const selectedOption = SORT_OPTIONS.find(
    (option) => option.id === sortOptionId,
  );
  const canSort =
    selectedOption && "sortBy" in selectedOption && "order" in selectedOption;
  if (!canSort || !selectedOption) return products;

  const { sortBy, order } = selectedOption;
  const sortedCopy = products.slice();

  return sortedCopy.sort((productA, productB) =>
    compareProductValues(productA[sortBy], productB[sortBy], order),
  );
}
