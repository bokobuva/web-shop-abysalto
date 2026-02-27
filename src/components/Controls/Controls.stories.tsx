import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { PriceRangeId, SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer, { initialSearchState } from "@/store/searchSlice";

import { Controls } from "@/components/Controls";

const mockCategories = [
  { slug: "beauty", name: "Beauty" },
  { slug: "fragrances", name: "Fragrances" },
  { slug: "furniture", name: "Furniture" },
  { slug: "groceries", name: "Groceries" },
];

const createStore = (preloadedState?: {
  filters?: { categorySlug: string | null; priceRangeId: PriceRangeId | null };
  sort?: { sortOptionId: SortOptionId };
  search?: typeof initialSearchState;
  categories?: {
    items: typeof mockCategories | undefined;
    isLoading: boolean;
    error: string | null;
  };
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
      categories: preloadedState?.categories ?? {
        items: mockCategories,
        isLoading: false,
        error: null,
      },
      products: {
        items: [],
        isLoading: false,
        error: null,
      },
      filters: preloadedState?.filters ?? {
        categorySlug: null,
        priceRangeId: null,
      },
      sort: preloadedState?.sort ?? { sortOptionId: "default" as SortOptionId },
      search: preloadedState?.search ?? initialSearchState,
    },
  });

const meta: Meta<typeof Controls> = {
  title: "Components/Controls",
  component: Controls,
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

export const LoadingCategories: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createStore({
          categories: {
            items: undefined,
            isLoading: true,
            error: null,
          },
        })}
      >
        <Story />
      </Provider>
    ),
  ],
};
