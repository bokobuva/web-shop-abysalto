import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@/store/authSlice";
import { cartReducer } from "@/store/cartSlice";

import { CartDropdown } from "./CartDropdown";
import { CartIcon } from "@/components/icons";

const meta: Meta<typeof CartDropdown> = {
  title: "Components/CartDropdown",
  component: CartDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const cart = context.parameters?.cart as
        | {
            productId: string;
            quantity: number;
            name: string;
            price: number;
            image: string;
          }[]
        | undefined;
      const cartItems = cart ?? [];
      return (
        <Provider
          store={configureStore({
            reducer: { auth: authReducer, cart: cartReducer },
            preloadedState: {
              auth: {
                user: null,
                isLoading: false,
                error: null,
                isInitialized: true,
              },
              cart: { items: cartItems },
            },
          })}
        >
          <div className="flex justify-end p-8">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <CartDropdown>
      <div className="relative flex cursor-pointer items-center justify-center text-gray-900 dark:text-zinc-50">
        <CartIcon />
      </div>
    </CartDropdown>
  ),
};

export const WithItems: Story = {
  parameters: {
    cart: [
      {
        productId: "1",
        quantity: 2,
        name: "Premium Serum",
        price: 49.99,
        image: "",
      },
      {
        productId: "2",
        quantity: 1,
        name: "Eyeshadow Palette",
        price: 24.99,
        image: "",
      },
    ],
  },
  render: () => {
    const items = [
      {
        productId: "1",
        quantity: 2,
        name: "Premium Serum",
        price: 49.99,
        image: "",
      },
      {
        productId: "2",
        quantity: 1,
        name: "Eyeshadow Palette",
        price: 24.99,
        image: "",
      },
    ];
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return (
      <CartDropdown>
        <div className="relative flex cursor-pointer items-center justify-center text-gray-900 dark:text-zinc-50">
          <CartIcon />
          <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
            {count}
          </span>
        </div>
      </CartDropdown>
    );
  },
};
