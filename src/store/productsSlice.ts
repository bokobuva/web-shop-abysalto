import { createSlice } from "@reduxjs/toolkit";

import type { Product } from "@/app/shared/types";

type ProductsState = {
  items: Product[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: { payload: Product[] }) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setProductsLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setProductsError: (state, action: { payload: string }) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setProducts, setProductsLoading, setProductsError } =
  productsSlice.actions;
export default productsSlice.reducer;
