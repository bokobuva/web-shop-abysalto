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

import { Sort } from "@/components/Sort";

const createStore = (preloadedState?: {
  sort?: { sortOptionId: SortOptionId };
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
      search: { searchQuery: "" },
    },
  });

const renderWithRedux = (preloadedState?: {
  sort?: { sortOptionId: SortOptionId };
}) => {
  const store = createStore(preloadedState);
  return {
    ...render(
      <Provider store={store}>
        <Sort />
      </Provider>,
    ),
    store,
  };
};

describe("Sort", () => {
  it("renders Sort heading", () => {
    renderWithRedux();
    expect(screen.getByRole("heading", { name: /sort/i })).toBeInTheDocument();
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
