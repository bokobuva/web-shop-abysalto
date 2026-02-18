import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    filters: filtersReducer,
    sort: sortReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  setProducts,
  setProductsLoading,
  setProductsError,
} from "@/store/productsSlice";
export {
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
} from "@/store/categoriesSlice";
export { setCategory, setPriceRange, resetFilters } from "@/store/filtersSlice";
export { setSortOption } from "@/store/sortSlice";
export { setSearchQuery } from "@/store/searchSlice";
export * from "@/store/selectors";
