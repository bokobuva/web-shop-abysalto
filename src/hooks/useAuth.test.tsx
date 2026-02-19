import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

import * as authApi from "@/app/api/auth";
import { getTokens } from "@/lib/auth/tokenStorage";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";
import paginationReducer from "@/store/paginationSlice";
import { authReducer } from "@/store/authSlice";

import { useAuth } from "./useAuth";

jest.mock("@/app/api/auth");
jest.mock("@/lib/auth/tokenStorage");

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockGetTokens = getTokens as jest.MockedFunction<typeof getTokens>;

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
      search: { searchQuery: "" },
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
  <Provider store={createStore()}>{children}</Provider>
);

describe("useAuth", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes as anonymous when no tokens", async () => {
    mockGetTokens.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.user).toBeNull();
    expect(mockAuthApi.getMe).not.toHaveBeenCalled();
  });

  it("loads user when tokens exist", async () => {
    mockGetTokens.mockReturnValue({
      accessToken: "access-123",
      refreshToken: "refresh-456",
    });
    mockAuthApi.getMe.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(mockAuthApi.getMe).toHaveBeenCalledWith("access-123");
  });

  it("login sets user on success", async () => {
    mockGetTokens.mockReturnValue(null);
    mockAuthApi.login.mockResolvedValue({
      ...mockUser,
      accessToken: "access",
      refreshToken: "refresh",
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.login("emilys", "emilyspass");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(mockAuthApi.login).toHaveBeenCalledWith({
      username: "emilys",
      password: "emilyspass",
    });
  });

  it("login sets error on failure", async () => {
    mockGetTokens.mockReturnValue(null);
    mockAuthApi.login.mockRejectedValue(new Error("Invalid credentials"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      try {
        await result.current.login("wrong", "wrong");
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Invalid credentials");
    });
    expect(result.current.user).toBeNull();
  });

  it("logout clears user", async () => {
    mockGetTokens.mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh",
    });
    mockAuthApi.getMe.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(mockAuthApi.logout).toHaveBeenCalled();
  });
});
