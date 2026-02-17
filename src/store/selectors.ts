import { createSelector } from "@reduxjs/toolkit";

import { filterProducts } from "@/lib/filters/filterProducts";

import type { RootState } from "./index";

export const selectProducts = (state: RootState) => state.products.items;
const selectCategorySlug = (state: RootState) => state.filters.categorySlug;
const selectPriceRangeId = (state: RootState) => state.filters.priceRangeId;

export const selectFilteredProducts = createSelector(
  [selectProducts, selectCategorySlug, selectPriceRangeId],
  filterProducts,
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
