import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

import { authReducer } from "@/store/authSlice";

import { AuthBar } from "./AuthBar";

const mockUser: AuthUser = {
  id: 1,
  username: "emilys",
  email: "emily.johnson@x.dummyjson.com",
  firstName: "Emily",
  lastName: "Johnson",
  image: "https://dummyjson.com/icon/emilys/128",
};

const createStore = (user: AuthUser | null, isInitialized = true) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user,
        isLoading: false,
        error: null,
        isInitialized,
      },
    },
  });

const meta: Meta<typeof AuthBar> = {
  title: "Components/AuthBar",
  component: AuthBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const auth = context.parameters?.auth as
        | { user?: AuthUser | null; isInitialized?: boolean }
        | undefined;
      const user = auth?.user ?? null;
      const isInitialized = auth?.isInitialized ?? true;
      return (
        <Provider store={createStore(user, isInitialized)}>
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

export const Loading: Story = {
  parameters: {
    auth: { user: null, isInitialized: false },
  },
};
