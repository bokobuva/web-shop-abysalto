import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { PriceRangeId, SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";

import { Filters } from "@/components/Filters";

const mockCategories = [
  { slug: "beauty", name: "Beauty" },
  { slug: "furniture", name: "Furniture" },
];

const createStore = (
  filtersState?: {
    categorySlug: string | null;
    priceRangeId: PriceRangeId | null;
  },
  categoriesState?: {
    items: typeof mockCategories | undefined;
    isLoading: boolean;
    error: string | null;
  },
) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
    },
    preloadedState: {
      categories: categoriesState ?? {
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
      sort: { sortOptionId: "default" as SortOptionId },
      search: { searchQuery: "" },
    },
  });

const renderWithRedux = (filtersState?: {
  categorySlug: string | null;
  priceRangeId: PriceRangeId | null;
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
  it("shows category loader when categories is undefined", () => {
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
        <Filters />
      </Provider>,
    );
    expect(
      screen.getByRole("status", { name: /loading categories/i }),
    ).toBeInTheDocument();
  });

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
      screen.getByRole("radiogroup", { name: /price range/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /price range: \$10 – \$50/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /price range: \$50 – \$100/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /price range: \$100\+/i }),
    ).toBeInTheDocument();
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
    await userEvent.click(
      screen.getByRole("radio", { name: /price range: \$10 – \$50/i }),
    );
    expect(
      screen.getByRole("radio", { name: /price range: \$10 – \$50/i }),
    ).toHaveAttribute("aria-checked", "true");
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

  it("makes all price range options focusable via Tab", async () => {
    renderWithRedux();
    const user = userEvent.setup();

    const categorySelect = screen.getByLabelText(/select category to filter/i);
    const price10_50 = screen.getByRole("radio", {
      name: /price range: \$10 – \$50/i,
    });
    const price50_100 = screen.getByRole("radio", {
      name: /price range: \$50 – \$100/i,
    });
    const price100plus = screen.getByRole("radio", {
      name: /price range: \$100\+/i,
    });

    categorySelect.focus();
    await user.tab();
    expect(price10_50).toHaveFocus();
    await user.tab();
    expect(price50_100).toHaveFocus();
    await user.tab();
    expect(price100plus).toHaveFocus();
  });

  it("selects price range on Enter key", async () => {
    renderWithRedux();
    const user = userEvent.setup();

    const price50_100 = screen.getByRole("radio", {
      name: /price range: \$50 – \$100/i,
    });
    price50_100.focus();
    await user.keyboard("{Enter}");

    expect(price50_100).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("button", { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it("selects price range on Space key", async () => {
    renderWithRedux();
    const user = userEvent.setup();

    const price100plus = screen.getByRole("radio", {
      name: /price range: \$100\+/i,
    });
    price100plus.focus();
    await user.keyboard(" ");

    expect(price100plus).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("button", { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });
});
