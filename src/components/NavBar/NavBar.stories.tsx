import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

import { authReducer } from "@/store/authSlice";
import { cartReducer } from "@/store/cartSlice";

import { NavBar } from "./NavBar";

const mockUser: AuthUser = {
  id: 1,
  username: "emilys",
  email: "emily.johnson@x.dummyjson.com",
  firstName: "Emily",
  lastName: "Johnson",
  image: "https://dummyjson.com/icon/emilys/128",
};

const createStore = (
  user: AuthUser | null,
  isInitialized = true,
  cartItems: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }[] = [],
) =>
  configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState: {
      auth: {
        user,
        isLoading: false,
        error: null,
        isInitialized,
      },
      cart: { items: cartItems },
    },
  });

const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar",
  component: NavBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const auth = context.parameters?.auth as
        | { user?: AuthUser | null; isInitialized?: boolean }
        | undefined;
      const cart = context.parameters?.cart as
        | {
            productId: string;
            quantity: number;
            name: string;
            price: number;
            image: string;
          }[]
        | undefined;
      const user = auth?.user ?? null;
      const isInitialized = auth?.isInitialized ?? true;
      const cartItems = cart ?? [];
      return (
        <Provider store={createStore(user, isInitialized, cartItems)}>
          <div className="flex items-center justify-end border border-gray-200 p-4 dark:border-gray-700">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Anonymous: Story = {
  parameters: {
    auth: { user: null, isInitialized: true },
  },
};

export const Authenticated: Story = {
  parameters: {
    auth: { user: mockUser, isInitialized: true },
  },
};

export const WithCartBadge: Story = {
  parameters: {
    auth: { user: null, isInitialized: true },
    cart: [
      { productId: "1", quantity: 5, name: "Product A", price: 29, image: "" },
    ],
  },
};

export const Loading: Story = {
  parameters: {
    auth: { user: null, isInitialized: false },
  },
};
