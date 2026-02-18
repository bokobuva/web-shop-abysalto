import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";

import { Controls } from "@/components/Controls";

const mockCategories = [
  { slug: "beauty", name: "Beauty" },
  { slug: "furniture", name: "Furniture" },
];

const createStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
    },
    preloadedState: {
      categories: {
        items: mockCategories,
        isLoading: false,
        error: null,
      },
      products: {
        items: [],
        isLoading: false,
        error: null,
      },
      filters: {
        categorySlug: null,
        priceRangeId: null,
      },
      sort: { sortOptionId: "default" as SortOptionId },
      search: { searchQuery: "" },
    },
  });

const renderWithRedux = () =>
  render(
    <Provider store={createStore()}>
      <Controls />
    </Provider>,
  );

describe("Controls", () => {
  it("renders Filters with header", () => {
    renderWithRedux();
    expect(
      screen.getByRole("heading", { name: /filters/i }),
    ).toBeInTheDocument();
  });

  it("renders SearchAndSort section", () => {
    renderWithRedux();
    expect(
      screen.getByRole("region", { name: /search and sort/i }),
    ).toBeInTheDocument();
  });

  it("renders search input, filter category select and sort select", () => {
    renderWithRedux();
    expect(
      screen.getByPlaceholderText(/search products by name/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/select category to filter/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/select sort order/i)).toBeInTheDocument();
  });

  it("shows category loader when categories undefined", () => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        categories: categoriesReducer,
        filters: filtersReducer,
        sort: sortReducer,
        search: searchReducer,
      },
      preloadedState: {
        categories: {
          items: undefined,
          isLoading: false,
          error: null,
        },
        products: { items: [], isLoading: false, error: null },
        filters: { categorySlug: null, priceRangeId: null },
        sort: { sortOptionId: "default" as SortOptionId },
        search: { searchQuery: "" },
      },
    });
    render(
      <Provider store={store}>
        <Controls />
      </Provider>,
    );
    expect(
      screen.getByRole("status", { name: /loading categories/i }),
    ).toBeInTheDocument();
  });
});
