import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
  { slug: "fragrances", name: "Fragrances" },
  { slug: "furniture", name: "Furniture" },
  { slug: "groceries", name: "Groceries" },
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

const meta: Meta<typeof Filters> = {
  title: "Components/Filters",
  component: Filters,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider store={createStore()}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCategorySelected: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createStore({ categorySlug: "beauty", priceRangeId: null })}
      >
        <Story />
      </Provider>
    ),
  ],
};

export const WithPriceRangeSelected: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createStore({ categorySlug: null, priceRangeId: "10-50" })}
      >
        <Story />
      </Provider>
    ),
  ],
};

export const WithAllFiltersSelected: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createStore({ categorySlug: "furniture", priceRangeId: "100+" })}
      >
        <Story />
      </Provider>
    ),
  ],
};

export const LoadingCategories: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createStore(undefined, {
          items: undefined,
          isLoading: true,
          error: null,
        })}
      >
        <Story />
      </Provider>
    ),
  ],
};
