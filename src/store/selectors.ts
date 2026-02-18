import { createSelector } from "@reduxjs/toolkit";

import { paginate } from "@/lib/pagination";
import { filterProducts } from "@/lib/filters/filterProducts";
import { searchProducts } from "@/lib/search/searchProducts";
import { sortProducts } from "@/lib/sort/sortProducts";

import type { Product } from "@/app/shared/types";

import type { RootState } from "@/store";

export const selectProducts = (state: RootState) => state.products.items;

export const selectProductById = (
  state: RootState,
  productId: string | null,
): Product | null => {
  if (!productId) return null;
  return state.products.items?.find((p) => p.id === productId) ?? null;
};
export const selectCategorySlug = (state: RootState) =>
  state.filters.categorySlug;
export const selectPriceRangeId = (state: RootState) =>
  state.filters.priceRangeId;
export const selectSearchQuery = (state: RootState) => state.search.searchQuery;
export const selectSortOptionId = (state: RootState) => state.sort.sortOptionId;

export const selectFilteredProducts = createSelector(
  [selectProducts, selectCategorySlug, selectPriceRangeId],
  filterProducts,
);

const selectSearchedProducts = createSelector(
  [selectFilteredProducts, selectSearchQuery],
  searchProducts,
);

export const selectFilteredAndSortedProducts = createSelector(
  [selectSearchedProducts, selectSortOptionId],
  sortProducts,
);

export const selectCurrentPage = (state: RootState) =>
  state.pagination.currentPage;
const selectPageSize = (state: RootState) => state.pagination.pageSize;

export const selectPaginatedProducts = createSelector(
  [selectFilteredAndSortedProducts, selectCurrentPage, selectPageSize],
  (products, page, pageSize) => paginate(products, page, pageSize),
);

export const selectTotalFilteredCount = createSelector(
  [selectFilteredAndSortedProducts],
  (products) => products?.length ?? 0,
);

export const selectTotalPages = createSelector(
  [selectTotalFilteredCount, selectPageSize],
  (totalCount, pageSize) =>
    pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0,
);

export const selectShowPagination = createSelector(
  [selectTotalFilteredCount, selectPageSize],
  (totalCount, pageSize) => totalCount > pageSize,
);

export const selectProductsLoading = (state: RootState) =>
  state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectCategories = (state: RootState) => state.categories.items;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.isLoading;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;
export const selectFilters = (state: RootState) => state.filters;
