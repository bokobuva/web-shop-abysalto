import { createSelector } from "@reduxjs/toolkit";

import { filterProducts } from "@/lib/filters/filterProducts";
import { searchProducts } from "@/lib/search/searchProducts";
import { sortProducts } from "@/lib/sort/sortProducts";

import type { RootState } from "@/store";

export const selectProducts = (state: RootState) => state.products.items;
const selectCategorySlug = (state: RootState) => state.filters.categorySlug;
const selectPriceRangeId = (state: RootState) => state.filters.priceRangeId;
const selectSearchQuery = (state: RootState) => state.search.searchQuery;
const selectSortOptionId = (state: RootState) => state.sort.sortOptionId;

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

export const selectProductsLoading = (state: RootState) =>
  state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectCategories = (state: RootState) => state.categories.items;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.isLoading;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;
export const selectFilters = (state: RootState) => state.filters;
