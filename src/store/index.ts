import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";
import paginationReducer from "@/store/paginationSlice";
import { authReducer } from "@/store/authSlice";
import { cartReducer } from "@/store/cartSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    filters: filtersReducer,
    sort: sortReducer,
    search: searchReducer,
    pagination: paginationReducer,
    auth: authReducer,
    cart: cartReducer,
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
export { setCurrentPage, resetPagination } from "@/store/paginationSlice";
export {
  setUser,
  setAuthLoading,
  setAuthError,
  setAuthInitialized,
} from "@/store/authSlice";
export {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCart,
} from "@/store/cartSlice";
