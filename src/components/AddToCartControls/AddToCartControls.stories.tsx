import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { Product } from "@/app/shared/types";

import { cartReducer } from "@/store/cartSlice";

import { AddToCartControls } from "./AddToCartControls";

const mockProduct: Product = {
  id: "1",
  name: "Premium Serum",
  price: 49.99,
  image: "https://example.com/serum.jpg",
  description: "A luxurious skincare serum.",
  category: "beauty",
};

const meta: Meta<typeof AddToCartControls> = {
  title: "Components/AddToCartControls",
  component: AddToCartControls,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider
        store={configureStore({
          reducer: { cart: cartReducer },
          preloadedState: { cart: { items: [] } },
        })}
      >
        <Story />
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const WithCallback: Story = {
  args: {
    product: mockProduct,
    onAddToCart: () => alert("Added! Modal would close here."),
  },
};
