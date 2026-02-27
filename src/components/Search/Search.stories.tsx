import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";

import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer, { initialSearchState } from "@/store/searchSlice";

import { Search } from "@/components/Search";

const createStore = (preloadedState?: { search?: typeof initialSearchState }) =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
    },
    preloadedState: {
      sort: { sortOptionId: "default" as SortOptionId },
      search: preloadedState?.search ?? initialSearchState,
    },
  });

const meta: Meta<typeof Search> = {
  title: "Components/Search",
  component: Search,
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
      <Provider
        store={createStore({
          search: { ...initialSearchState, searchQuery: "mascara" },
        })}
      >
        <Story />
      </Provider>
    ),
  ],
};
