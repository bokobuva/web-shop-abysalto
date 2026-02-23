import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { CartItem as CartItemType } from "@/app/shared/types";

import { cartReducer } from "@/store/cartSlice";

import { CartItem } from "./CartItem";

const mockItem: CartItemType = {
  productId: "1",
  quantity: 2,
  name: "Premium Serum",
  price: 49.99,
  image:
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
};

const meta: Meta<typeof CartItem> = {
  title: "Components/CartItem",
  component: CartItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider
        store={configureStore({
          reducer: { cart: cartReducer },
          preloadedState: { cart: { items: [mockItem] } },
        })}
      >
        <div className="w-80 border border-gray-200 dark:border-gray-700">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: mockItem,
    onQuantityChange: () => {},
    onDelete: () => {},
  },
};

export const WithoutImage: Story = {
  args: {
    item: { ...mockItem, image: "" },
    onQuantityChange: () => {},
    onDelete: () => {},
  },
};
