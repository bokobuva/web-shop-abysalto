import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { PriceRangeId, SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer, { initialSearchState } from "@/store/searchSlice";

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
      search: initialSearchState,
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
        search: initialSearchState,
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

  it("renders price range select with options", () => {
    renderWithRedux();
    expect(
      screen.getByLabelText(/select price range to filter/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /all price ranges/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /\$10 – \$50/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /\$50 – \$100/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /\$100\+/ })).toBeInTheDocument();
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

  it("updates price range when select changed", async () => {
    renderWithRedux();
    const select = screen.getByLabelText(/select price range to filter/i);
    await userEvent.selectOptions(select, "10-50");
    expect(select).toHaveValue("10-50");
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
    expect(screen.getByLabelText(/select price range to filter/i)).toHaveValue(
      "",
    );
    expect(
      screen.queryByRole("button", { name: /clear all filters/i }),
    ).not.toBeInTheDocument();
  });

  it("price range select is focusable via Tab", async () => {
    renderWithRedux();
    const user = userEvent.setup();

    const categorySelect = screen.getByLabelText(/select category to filter/i);
    const priceSelect = screen.getByLabelText(/select price range to filter/i);

    categorySelect.focus();
    await user.tab();
    expect(priceSelect).toHaveFocus();
  });
});
