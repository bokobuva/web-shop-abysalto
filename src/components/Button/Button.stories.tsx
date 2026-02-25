import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { Button } from "@/components/Button";
import { TrashIcon } from "@/components/icons";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    dataTestId: { control: "text" },
    ariaLabel: { control: "text" },
    disabled: { control: "boolean" },
    variant: { control: "select", options: ["primary", "outline"] },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Details",
    dataTestId: "button-details",
    ariaLabel: "View product details",
  },
};

export const LongLabel: Story = {
  args: {
    children: "View Product Details",
    dataTestId: "button-view-details",
    ariaLabel: "View full product details",
  },
};

export const ShortLabel: Story = {
  args: {
    children: "OK",
    dataTestId: "button-ok",
    ariaLabel: "Confirm",
  },
};

export const Accessible: Story = {
  args: {
    children: "Add to Cart",
    dataTestId: "button-add-to-cart",
    ariaLabel: "Add this product to your shopping cart",
  },
};

export const Disabled: Story = {
  args: {
    children: "Details",
    dataTestId: "button-disabled",
    ariaLabel: "View product details",
    disabled: true,
  },
};

export const IconOnly: Story = {
  args: {
    children: <TrashIcon size={20} />,
    dataTestId: "button-trash",
    ariaLabel: "Remove item",
  },
};
