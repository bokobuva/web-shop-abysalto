import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "./productsSlice";
import categoriesReducer from "./categoriesSlice";
import filtersReducer from "./filtersSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  setProducts,
  setProductsLoading,
  setProductsError,
} from "./productsSlice";
export {
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
} from "./categoriesSlice";
export { setCategory, setPriceRange, resetFilters } from "./filtersSlice";
export * from "./selectors";
