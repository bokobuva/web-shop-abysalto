import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { PriceRangeId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";

import { Filters } from "./Filters";

const mockCategories = [
  { slug: "beauty", name: "Beauty" },
  { slug: "fragrances", name: "Fragrances" },
  { slug: "furniture", name: "Furniture" },
  { slug: "groceries", name: "Groceries" },
];

const createStore = (filtersState?: {
  categorySlug: string | null;
  priceRangeId: PriceRangeId | null;
}) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
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
