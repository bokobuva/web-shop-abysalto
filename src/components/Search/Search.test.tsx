import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";

import { Search } from "@/components/Search";

const createStore = (preloadedState?: { search?: { searchQuery: string } }) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
    },
    preloadedState: {
      sort: { sortOptionId: "default" as SortOptionId },
      search: preloadedState?.search ?? { searchQuery: "" },
    },
  });

const renderWithRedux = (preloadedState?: {
  search?: { searchQuery: string };
}) => {
  const store = createStore(preloadedState);
  return {
    ...render(
      <Provider store={store}>
        <Search />
      </Provider>,
    ),
    store,
  };
};

describe("Search", () => {
  it("renders search input with placeholder", () => {
    renderWithRedux();
    const input = screen.getByPlaceholderText(/search products by name/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-testid", "search-products");
  });

  it("renders Search heading", () => {
    renderWithRedux();
    expect(
      screen.getByRole("heading", { name: /search/i }),
    ).toBeInTheDocument();
  });

  it("search input value reflects searchQuery", () => {
    renderWithRedux({ search: { searchQuery: "apple" } });
    expect(screen.getByPlaceholderText(/search products by name/i)).toHaveValue(
      "apple",
    );
  });

  it("dispatches setSearchQuery when typing", async () => {
    const { store } = renderWithRedux();
    const input = screen.getByPlaceholderText(/search products by name/i);
    await userEvent.type(input, "test");
    expect(store.getState().search.searchQuery).toBe("test");
  });
});
