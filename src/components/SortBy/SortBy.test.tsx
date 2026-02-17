import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";

import { SortBy } from "./SortBy";

const createStore = (sortOptionId = "default") =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
    },
    preloadedState: {
      sort: { sortOptionId },
    },
  });

const renderWithRedux = (sortOptionId = "default") => {
  const store = createStore(sortOptionId);
  return {
    ...render(
      <Provider store={store}>
        <SortBy />
      </Provider>,
    ),
    store,
  };
};

describe("SortBy", () => {
  it("renders Sort by heading", () => {
    renderWithRedux();
    expect(
      screen.getByRole("heading", { name: /sort by/i }),
    ).toBeInTheDocument();
  });

  it("renders select with all sort options", () => {
    renderWithRedux();
    const select = screen.getByLabelText(/select sort order/i);
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("data-testid", "sort-by");
    expect(
      screen.getByRole("option", { name: /default/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Price: Low to High" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Price: High to Low" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Name: A to Z" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Name: Z to A" }),
    ).toBeInTheDocument();
  });

  it("shows default selected when initial state is default", () => {
    renderWithRedux();
    const select = screen.getByLabelText(/select sort order/i);
    expect(select).toHaveValue("default");
  });

  it("shows price-asc selected when preloaded", () => {
    renderWithRedux("price-asc");
    const select = screen.getByLabelText(/select sort order/i);
    expect(select).toHaveValue("price-asc");
  });

  it("dispatches setSortOption when option changed", async () => {
    const { store } = renderWithRedux();
    const select = screen.getByLabelText(/select sort order/i);
    await userEvent.selectOptions(select, "price-desc");
    expect(store.getState().sort.sortOptionId).toBe("price-desc");
  });
});
