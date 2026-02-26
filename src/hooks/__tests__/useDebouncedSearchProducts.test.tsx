import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import * as productsService from "@/app/services/products";

import searchReducer from "@/store/searchSlice";
import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import paginationReducer from "@/store/paginationSlice";

import { useDebouncedSearchProducts } from "../useDebouncedSearchProducts";

const mockFetchSearchProducts =
  productsService.fetchSearchProducts as jest.Mock;

jest.mock("@/app/services/products", () => ({
  ...jest.requireActual("@/app/services/products"),
  fetchSearchProducts: jest.fn(),
}));

const createStore = (searchQuery = "") =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
      pagination: paginationReducer,
    },
    preloadedState: {
      search: {
        searchQuery,
        searchResults: null,
        searchLoading: false,
        searchError: null,
      },
    },
  });

describe("useDebouncedSearchProducts", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetchSearchProducts.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("clears search results when query is empty after debounce", () => {
    const store = createStore("");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useDebouncedSearchProducts(), { wrapper });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(mockFetchSearchProducts).not.toHaveBeenCalled();
    expect(store.getState().search.searchResults).toBeNull();
    expect(store.getState().search.searchError).toBeNull();
  });

  it("fetches and sets search results when query is non-empty after debounce", async () => {
    const mockProducts = [
      {
        id: "1",
        name: "Phone Case",
        price: 29.99,
        image: "",
        description: "",
        category: "beauty",
      },
    ];
    mockFetchSearchProducts.mockResolvedValue(mockProducts);

    const store = createStore("phone");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useDebouncedSearchProducts(), { wrapper });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    await act(async () => {
      await mockFetchSearchProducts;
    });

    expect(mockFetchSearchProducts).toHaveBeenCalledWith("phone");
    expect(store.getState().search.searchResults).toEqual(mockProducts);
  });

  it("sets search error when fetch fails", async () => {
    jest.useRealTimers();
    mockFetchSearchProducts.mockRejectedValue(new Error("Network error"));

    const store = createStore("phone");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useDebouncedSearchProducts(), { wrapper });

    await waitFor(
      () => {
        expect(store.getState().search.searchError).toBe("Network error");
        expect(store.getState().search.searchResults).toEqual([]);
      },
      { timeout: 1000 },
    );

    jest.useFakeTimers();
  });

  it("does not fetch when query is trimmed to empty", () => {
    const store = createStore("   ");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useDebouncedSearchProducts(), { wrapper });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(mockFetchSearchProducts).not.toHaveBeenCalled();
  });
});
