import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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

const meta: Meta<typeof SearchAndSort> = {
  title: "Components/SearchAndSort",
  component: SearchAndSort,
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

export const WithSearchQuery: Story = {
  decorators: [
    (Story) => (
      <Provider store={createStore({ search: { searchQuery: "mascara" } })}>
        <Story />
      </Provider>
    ),
  ],
};

export const WithPriceAscSelected: Story = {
  decorators: [
    (Story) => (
      <Provider store={createStore({ sort: { sortOptionId: "price-asc" } })}>
        <Story />
      </Provider>
    ),
  ],
};

export const WithNameDescSelected: Story = {
  decorators: [
    (Story) => (
      <Provider store={createStore({ sort: { sortOptionId: "name-desc" } })}>
        <Story />
      </Provider>
    ),
  ],
};
