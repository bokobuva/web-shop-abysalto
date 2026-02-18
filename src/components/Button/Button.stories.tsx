import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { Button } from "@/components/Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    dataTestId: { control: "text" },
    ariaLabel: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Details",
    dataTestId: "button-details",
    ariaLabel: "View product details",
  },
};

export const LongLabel: Story = {
  args: {
    label: "View Product Details",
    dataTestId: "button-view-details",
    ariaLabel: "View full product details",
  },
};

export const ShortLabel: Story = {
  args: {
    label: "OK",
    dataTestId: "button-ok",
    ariaLabel: "Confirm",
  },
};

export const Accessible: Story = {
  args: {
    label: "Add to Cart",
    dataTestId: "button-add-to-cart",
    ariaLabel: "Add this product to your shopping cart",
  },
};

export const Disabled: Story = {
  args: {
    label: "Details",
    dataTestId: "button-disabled",
    ariaLabel: "View product details",
    disabled: true,
  },
};
