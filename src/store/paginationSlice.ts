import { createSlice } from "@reduxjs/toolkit";

import { PAGE_SIZE } from "@/app/shared/constants";

type PaginationState = {
  currentPage: number;
  pageSize: number;
};

const initialState: PaginationState = {
  currentPage: 1,
  pageSize: PAGE_SIZE,
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCurrentPage: (state, action: { payload: number }) => {
      state.currentPage = action.payload;
    },
    resetPagination: () => initialState,
  },
});

export const { setCurrentPage, resetPagination } = paginationSlice.actions;
export default paginationSlice.reducer;
