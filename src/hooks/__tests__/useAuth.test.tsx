import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

import * as authApi from "@/app/services/auth";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer, { initialSearchState } from "@/store/searchSlice";
import paginationReducer from "@/store/paginationSlice";
import { authReducer } from "@/store/authSlice";

import { AuthProvider } from "@/app/providers/AuthProvider";
import { useAuth } from "../useAuth";

jest.mock("@/app/services/auth");

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

const mockUser = {
  id: 1,
  username: "emilys",
  email: "emily@example.com",
  firstName: "Emily",
  lastName: "Johnson",
};

const createStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
      pagination: paginationReducer,
      auth: authReducer,
    },
    preloadedState: {
      products: { items: [], isLoading: false, error: null },
      categories: { items: [], isLoading: false, error: null },
      filters: { categorySlug: null, priceRangeId: null },
      sort: { sortOptionId: "default" as SortOptionId },
      search: initialSearchState,
      pagination: { currentPage: 1, pageSize: 20 },
      auth: {
        user: null,
        isLoading: false,
        error: null,
        isInitialized: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createStore()}>
    <AuthProvider>{children}</AuthProvider>
  </Provider>
);

describe("useAuth", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes as anonymous when getMe fails and refresh fails", async () => {
    mockAuthApi.getMe.mockRejectedValue(new Error("Unauthorized"));
    mockAuthApi.refreshToken.mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.user).toBeNull();
    expect(mockAuthApi.getMe).toHaveBeenCalled();
  });

  it("loads user when getMe succeeds", async () => {
    mockAuthApi.getMe.mockResolvedValue({
      ...mockUser,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.user).toMatchObject(mockUser);
    expect(mockAuthApi.getMe).toHaveBeenCalledWith();
  });

  it("login sets user on success", async () => {
    mockAuthApi.getMe.mockRejectedValue(new Error("Unauthorized"));
    mockAuthApi.login.mockResolvedValue({
      ...mockUser,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const success = await act(async () =>
      result.current.login("emilys", "emilyspass"),
    );

    expect(success).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(mockAuthApi.login).toHaveBeenCalledWith({
      username: "emilys",
      password: "emilyspass",
    });
  });

  it("login sets error on failure", async () => {
    mockAuthApi.getMe.mockRejectedValue(new Error("Unauthorized"));
    mockAuthApi.login.mockRejectedValue(new Error("Invalid credentials"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const success = await act(async () =>
      result.current.login("wrong", "wrong"),
    );

    expect(success).toBe(false);
    await waitFor(() => {
      expect(result.current.error).toBe("Invalid credentials");
    });
    expect(result.current.user).toBeNull();
  });

  it("logout clears user", async () => {
    mockAuthApi.getMe.mockResolvedValue({
      ...mockUser,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    });
    mockAuthApi.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toMatchObject(mockUser);
    });

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(mockAuthApi.logout).toHaveBeenCalled();
  });
});
