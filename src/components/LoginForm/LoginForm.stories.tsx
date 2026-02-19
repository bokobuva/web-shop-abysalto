import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

import { authReducer } from "@/store/authSlice";

import { LoginForm } from "./LoginForm";

const createStore = (authState?: {
  user?: AuthUser | null;
  isLoading?: boolean;
  error?: string | null;
  isInitialized?: boolean;
}) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        ...authState,
      },
    },
  });

const meta: Meta<typeof LoginForm> = {
  title: "Components/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider store={createStore()}>
        <div className="max-w-md">
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
    onClose: () => {},
    onSuccess: () => {},
  },
};

export const Loading: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createStore({
          user: null,
          isLoading: true,
          error: null,
          isInitialized: true,
        })}
      >
        <div className="max-w-md">
          <Story />
        </div>
      </Provider>
    ),
  ],
  args: {
    onClose: () => {},
    onSuccess: () => {},
  },
};

export const WithError: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createStore({
          user: null,
          isLoading: false,
          error: "Invalid credentials. Please try again.",
          isInitialized: true,
        })}
      >
        <div className="max-w-md">
          <Story />
        </div>
      </Provider>
    ),
  ],
  args: {
    onClose: () => {},
    onSuccess: () => {},
  },
};
