import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";

import { Filters } from "./Filters";

const mockCategories = [
  { slug: "beauty", name: "Beauty" },
  { slug: "furniture", name: "Furniture" },
];

const createStore = (filtersState?: {
  categorySlug: string | null;
  priceRangeId: string | null;
}) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
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
      filters: filtersState ?? {
        categorySlug: null,
        priceRangeId: null,
      },
      sort: { sortOptionId: "default" },
    },
  });

const renderWithRedux = (filtersState?: {
  categorySlug: string | null;
  priceRangeId: string | null;
}) => {
  const store = createStore(filtersState);
  return {
    ...render(
      <Provider store={store}>
        <Filters />
      </Provider>,
    ),
    store,
  };
};

describe("Filters", () => {
  it("renders category select with options", () => {
    renderWithRedux();
    expect(
      screen.getByLabelText(/select category to filter/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /all categories/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /beauty/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /furniture/i }),
    ).toBeInTheDocument();
  });

  it("renders price range radio group", () => {
    renderWithRedux();
    expect(
      screen.getByRole("group", { name: /filter by price range/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/price range: \$10 – \$50/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/price range: \$50 – \$100/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/price range: \$100\+/i)).toBeInTheDocument();
  });

  it("does not show reset button when no filters applied", () => {
    renderWithRedux();
    expect(
      screen.queryByRole("button", { name: /clear all filters/i }),
    ).not.toBeInTheDocument();
  });

  it("shows reset button when category is selected", () => {
    renderWithRedux({ categorySlug: "beauty", priceRangeId: null });
    expect(
      screen.getByRole("button", { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it("updates category when category select changed", async () => {
    renderWithRedux();
    const select = screen.getByLabelText(/select category to filter/i);
    await userEvent.selectOptions(select, "beauty");
    expect(select).toHaveValue("beauty");
    expect(
      screen.getByRole("button", { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it("updates price range when radio selected", async () => {
    renderWithRedux();
    await userEvent.click(screen.getByLabelText(/price range: \$10 – \$50/i));
    expect(screen.getByLabelText(/price range: \$10 – \$50/i)).toBeChecked();
    expect(
      screen.getByRole("button", { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it("clears filters when reset button clicked", async () => {
    renderWithRedux({ categorySlug: "beauty", priceRangeId: "10-50" });
    await userEvent.click(
      screen.getByRole("button", { name: /clear all filters/i }),
    );
    expect(screen.getByLabelText(/select category to filter/i)).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: /clear all filters/i }),
    ).not.toBeInTheDocument();
  });
});
