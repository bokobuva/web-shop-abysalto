import { createSlice } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

type SortState = {
  sortOptionId: SortOptionId;
};

const initialState: SortState = {
  sortOptionId: "default",
};

export const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortOption: (state, action: { payload: SortOptionId }) => {
      state.sortOptionId = action.payload;
    },
  },
});

export const { setSortOption } = sortSlice.actions;
export default sortSlice.reducer;
