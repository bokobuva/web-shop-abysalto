import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";

import { SortBy } from "@/components/SortBy";

const createStore = (sortState?: { sortOptionId: SortOptionId }) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
    },
    preloadedState: {
      sort: sortState ?? { sortOptionId: "default" },
    },
  });

const meta: Meta<typeof SortBy> = {
  title: "Components/SortBy",
  component: SortBy,
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
      <Provider store={createStore({ sortOptionId: "price-asc" })}>
        <Story />
      </Provider>
    ),
  ],
};

export const WithNameDescSelected: Story = {
  decorators: [
    (Story) => (
      <Provider store={createStore({ sortOptionId: "name-desc" })}>
        <Story />
      </Provider>
    ),
  ],
};
