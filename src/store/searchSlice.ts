import { createSlice } from "@reduxjs/toolkit";

import type { Product } from "@/app/shared/types";

type SearchState = {
  searchQuery: string;
  searchResults: Product[] | null;
  searchLoading: boolean;
  searchError: string | null;
};

export const initialSearchState: SearchState = {
  searchQuery: "",
  searchResults: null,
  searchLoading: false,
  searchError: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    setSearchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: { payload: Product[] | null }) => {
      state.searchResults = action.payload;
      state.searchLoading = false;
      state.searchError = null;
    },
    setSearchLoading: (state, action: { payload: boolean }) => {
      state.searchLoading = action.payload;
      if (action.payload) state.searchError = null;
    },
    setSearchError: (state, action: { payload: string | null }) => {
      state.searchError = action.payload;
      state.searchLoading = false;
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setSearchError,
} = searchSlice.actions;
export default searchSlice.reducer;
