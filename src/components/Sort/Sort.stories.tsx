import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer, { initialSearchState } from "@/store/searchSlice";

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
      search: initialSearchState,
    },
  });

const meta: Meta<typeof Sort> = {
  title: "Components/Sort",
  component: Sort,
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
