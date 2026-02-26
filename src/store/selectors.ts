import { createSelector } from "@reduxjs/toolkit";

import { paginate } from "@/lib/pagination";
import { filterProducts } from "@/lib/filters/filterProducts";
import { sortProducts } from "@/lib/sort/sortProducts";

import type { Product } from "@/app/shared/types";

import type { RootState } from "@/store";

export const selectProducts = (state: RootState) => state.products.items;
export const selectSearchResults = (state: RootState) =>
  state.search.searchResults;
export const selectSearchLoading = (state: RootState) =>
  state.search.searchLoading;
export const selectSearchError = (state: RootState) => state.search.searchError;

export const selectProductById = (
  state: RootState,
  productId: string | null,
): Product | null => {
  if (!productId) return null;
  const fromSearch =
    state.search.searchResults?.find((p) => p.id === productId) ?? null;
  if (fromSearch) return fromSearch;
  return state.products.items?.find((p) => p.id === productId) ?? null;
};
export const selectCategorySlug = (state: RootState) =>
  state.filters.categorySlug;
export const selectPriceRangeId = (state: RootState) =>
  state.filters.priceRangeId;
export const selectSearchQuery = (state: RootState) => state.search.searchQuery;
export const selectSortOptionId = (state: RootState) => state.sort.sortOptionId;

/** Products filtered by category and price range (via filterProducts). */
export const selectFilteredProducts = createSelector(
  [selectProducts, selectCategorySlug, selectPriceRangeId],
  filterProducts,
);

/**
 * Base products for display. When search is active (searchResults !== null),
 * category and price filters apply to search results; otherwise to the full catalog.
 * Sort is applied downstream via selectFilteredAndSortedProducts.
 */
const selectProductsForDisplay = createSelector(
  [
    selectSearchResults,
    selectFilteredProducts,
    selectCategorySlug,
    selectPriceRangeId,
  ],
  (searchResults, filteredProducts, categorySlug, priceRangeId) => {
    if (searchResults !== null) {
      return filterProducts(searchResults, categorySlug, priceRangeId);
    }
    return filteredProducts;
  },
);

/** Filtered products further sorted by sort option (via sortProducts). */
export const selectFilteredAndSortedProducts = createSelector(
  [selectProductsForDisplay, selectSortOptionId],
  sortProducts,
);

export const selectCurrentPage = (state: RootState) =>
  state.pagination.currentPage;
const selectPageSize = (state: RootState) => state.pagination.pageSize;

/** Current page slice of filtered-and-sorted products (via paginate). */
export const selectPaginatedProducts = createSelector(
  [selectFilteredAndSortedProducts, selectCurrentPage, selectPageSize],
  (products, page, pageSize) => paginate(products, page, pageSize),
);

/** Total count of filtered-and-sorted products (before pagination). */
export const selectTotalFilteredCount = createSelector(
  [selectFilteredAndSortedProducts],
  (products) => products?.length ?? 0,
);

/** Number of pages given total filtered count and page size. */
export const selectTotalPages = createSelector(
  [selectTotalFilteredCount, selectPageSize],
  (totalCount, pageSize) =>
    pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0,
);

/** True when filtered results exceed page size (pagination UI should show). */
export const selectShowPagination = createSelector(
  [selectTotalFilteredCount, selectPageSize],
  (totalCount, pageSize) => totalCount > pageSize,
);

export const selectProductsLoading = (state: RootState) =>
  state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;

/** Loading when fetching catalog or search. */
export const selectProductsOrSearchLoading = createSelector(
  [selectProductsLoading, selectSearchLoading],
  (productsLoading, searchLoading) => productsLoading || searchLoading,
);

/** Error from catalog or search fetch. */
export const selectProductsOrSearchError = createSelector(
  [selectProductsError, selectSearchError],
  (productsError, searchError) => productsError ?? searchError ?? null,
);
export const selectCategories = (state: RootState) => state.categories.items;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.isLoading;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;
export const selectFilters = (state: RootState) => state.filters;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthInitialized = (state: RootState) =>
  state.auth.isInitialized;

export const selectCartItems = (state: RootState) => state.cart.items;

/** Sum of all cart item quantities. */
export const selectCartTotalCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0),
);
