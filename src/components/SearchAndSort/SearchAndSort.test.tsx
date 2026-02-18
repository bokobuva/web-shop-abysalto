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

import { SearchAndSort } from "@/components/SearchAndSort";

const createStore = (preloadedState?: {
  sort?: { sortOptionId: SortOptionId };
  search?: { searchQuery: string };
}) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
    },
    preloadedState: {
      sort: preloadedState?.sort ?? { sortOptionId: "default" },
      search: preloadedState?.search ?? { searchQuery: "" },
    },
  });

const renderWithRedux = (preloadedState?: {
  sort?: { sortOptionId: SortOptionId };
  search?: { searchQuery: string };
}) => {
  const store = createStore(preloadedState);
  return {
    ...render(
      <Provider store={store}>
        <SearchAndSort />
      </Provider>,
    ),
    store,
  };
};

describe("SearchAndSort", () => {
  it("renders Search and Sort section", () => {
    renderWithRedux();
    expect(
      screen.getByRole("region", { name: /search and sort/i }),
    ).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    renderWithRedux();
    const input = screen.getByPlaceholderText(/search products by name/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-testid", "search-products");
  });

  it("renders sort select with options", () => {
    renderWithRedux();
    const select = screen.getByLabelText(/select sort order/i);
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("data-testid", "sort-by");
    expect(
      screen.getByRole("option", { name: /default/i }),
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

  it("shows default sort selected when initial state is default", () => {
    renderWithRedux();
    const select = screen.getByLabelText(/select sort order/i);
    expect(select).toHaveValue("default");
  });

  it("dispatches setSortOption when option changed", async () => {
    const { store } = renderWithRedux();
    const select = screen.getByLabelText(/select sort order/i);
    await userEvent.selectOptions(select, "price-desc");
    expect(store.getState().sort.sortOptionId).toBe("price-desc");
  });
});
