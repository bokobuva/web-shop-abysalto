import { createSlice } from "@reduxjs/toolkit";

import type { Category } from "@/app/shared/types";

type CategoriesState = {
  items: Category[] | undefined;
  isLoading: boolean;
  error: string | null;
};

const initialState: CategoriesState = {
  items: undefined,
  isLoading: false,
  error: null,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: { payload: Category[] }) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCategoriesLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCategoriesError: (state, action: { payload: string }) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCategories, setCategoriesLoading, setCategoriesError } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
