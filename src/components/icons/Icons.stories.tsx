import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CartIcon, LoadingSpinner, TrashIcon } from "./Icons";

const meta: Meta<typeof CartIcon> = {
  title: "Components/Icons",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

export const CartIconDefault: StoryObj = {
  render: () => (
    <div className="text-gray-900 dark:text-zinc-50">
      <CartIcon />
    </div>
  ),
};

export const CartIconSmall: StoryObj = {
  render: () => (
    <div className="text-gray-900 dark:text-zinc-50">
      <CartIcon size={16} />
    </div>
  ),
};

export const CartIconLarge: StoryObj = {
  render: () => (
    <div className="text-gray-900 dark:text-zinc-50">
      <CartIcon size={32} />
    </div>
  ),
};

export const LoadingSpinnerDefault: StoryObj = {
  render: () => <LoadingSpinner />,
};

export const TrashIconDefault: StoryObj = {
  render: () => (
    <div className="text-gray-900 dark:text-zinc-50">
      <TrashIcon />
    </div>
  ),
};

export const TrashIconSmall: StoryObj = {
  render: () => (
    <div className="text-gray-900 dark:text-zinc-50">
      <TrashIcon size={16} />
    </div>
  ),
};
