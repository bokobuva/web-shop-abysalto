import { createSlice } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: { payload: AuthUser | null }) => {
      state.user = action.payload;
      if (action.payload !== null) {
        state.error = null;
      }
    },
    setAuthLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: { payload: string | null }) => {
      state.error = action.payload;
    },
    setAuthInitialized: (state, action: { payload: boolean }) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setUser, setAuthLoading, setAuthError, setAuthInitialized } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
