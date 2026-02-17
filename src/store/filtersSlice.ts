import { createSlice } from "@reduxjs/toolkit";

import type { PriceRangeId } from "@/app/shared/types";

type FiltersState = {
  categorySlug: string | null;
  priceRangeId: PriceRangeId | null;
};

const initialState: FiltersState = {
  categorySlug: null,
  priceRangeId: null,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action: { payload: string | null }) => {
      state.categorySlug = action.payload;
    },
    setPriceRange: (state, action: { payload: PriceRangeId | null }) => {
      state.priceRangeId = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setCategory, setPriceRange, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
