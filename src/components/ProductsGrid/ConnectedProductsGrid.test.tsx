import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import { setCategory } from "@/store";
import type { Product, SortOptionId } from "@/app/shared/types";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
}));
import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";
import paginationReducer from "@/store/paginationSlice";
import { cartReducer } from "@/store/cartSlice";

import { ConnectedProductsGrid } from "@/components/ProductsGrid/ConnectedProductsGrid";

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "1",
  name: "Test Product",
  price: 25,
  image: "",
  description: "",
  category: "beauty",
  ...overrides,
});

const mockCategories = [
  { slug: "beauty", name: "Beauty" },
  { slug: "furniture", name: "Furniture" },
];

const createStore = (products: Product[]) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
      pagination: paginationReducer,
      cart: cartReducer,
    },
    preloadedState: {
      products: {
        items: products,
        isLoading: false,
        error: null,
      },
      categories: {
        items: mockCategories,
        isLoading: false,
        error: null,
      },
      filters: { categorySlug: null, priceRangeId: null },
      sort: { sortOptionId: "default" as SortOptionId },
      search: { searchQuery: "" },
    },
  });

const renderWithRedux = (products: Product[]) => {
  const store = createStore(products);
  return {
    ...render(
      <Provider store={store}>
        <ConnectedProductsGrid />
      </Provider>,
    ),
    store,
  };
};

describe("ConnectedProductsGrid", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it("opens product modal when Details is clicked", async () => {
    const products = [
      createProduct({
        id: "42",
        name: "Featured Product",
        description: "Full description here",
      }),
    ];
    renderWithRedux(products);

    await userEvent.click(
      screen.getByRole("button", {
        name: /view details for featured product/i,
      }),
    );

    expect(mockReplace).toHaveBeenCalledWith("/?product=42");
  });

  it("shows product modal when URL has product param", () => {
    mockSearchParams.set("product", "1");
    const products = [
      createProduct({
        id: "1",
        name: "Modal Product",
        description: "Shown in modal",
      }),
    ];
    renderWithRedux(products);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    const withinDialog = within(dialog);
    expect(
      withinDialog.getByRole("heading", { name: "Modal Product" }),
    ).toBeInTheDocument();
    expect(withinDialog.getByText("Shown in modal")).toBeInTheDocument();
  });

  it("shows pagination when filtered results exceed 20", () => {
    const manyProducts = Array.from({ length: 25 }, (_, i) =>
      createProduct({
        id: String(i + 1),
        name: `Product ${i + 1}`,
        category: "beauty",
      }),
    );
    renderWithRedux(manyProducts);

    expect(
      screen.getByRole("navigation", { name: /pagination/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 20")).toBeInTheDocument();
    expect(screen.queryByText("Product 21")).not.toBeInTheDocument();
  });

  it("hides pagination when filtered results are 20 or less", () => {
    const fewProducts = Array.from({ length: 10 }, (_, i) =>
      createProduct({
        id: String(i + 1),
        name: `Product ${i + 1}`,
      }),
    );
    renderWithRedux(fewProducts);

    expect(
      screen.queryByRole("navigation", { name: /pagination/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
  });

  it("navigates to next page when Next clicked", async () => {
    const manyProducts = Array.from({ length: 25 }, (_, i) =>
      createProduct({
        id: String(i + 1),
        name: `Product ${i + 1}`,
        category: "beauty",
      }),
    );
    const { store } = renderWithRedux(manyProducts);

    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();
    expect(screen.getByText("Product 21")).toBeInTheDocument();
    expect(screen.getByText("Product 25")).toBeInTheDocument();
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    expect(store.getState().pagination.currentPage).toBe(2);
  });

  it("hides pagination when filter reduces results to 20 or less", async () => {
    const mixedProducts = [
      ...Array.from({ length: 25 }, (_, i) =>
        createProduct({
          id: `beauty-${i + 1}`,
          name: `Beauty ${i + 1}`,
          category: "beauty",
        }),
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        createProduct({
          id: `furniture-${i + 1}`,
          name: `Furniture ${i + 1}`,
          category: "furniture",
        }),
      ),
    ];
    const { store } = renderWithRedux(mixedProducts);

    expect(
      screen.getByRole("navigation", { name: /pagination/i }),
    ).toBeInTheDocument();

    store.dispatch(setCategory("furniture"));

    expect(await screen.findByText("Furniture 1")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("navigation", { name: /pagination/i }),
      ).not.toBeInTheDocument();
    });
  });
});
