import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { ProductCard } from "@/components/ProductCard";

const meta = {
  title: "Components/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    image: { control: "text" },
    price: { control: "number" },
    maxDescriptionLength: { control: "number" },
  },
  args: {
    price: 9.99,
    onClick: fn(),
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const DUMMY_IMAGE =
  "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp";

export const Default: Story = {
  args: {
    title: "Essence Mascara Lash Princess",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes.",
    image: DUMMY_IMAGE,
  },
};

export const ShortDescription: Story = {
  args: {
    title: "Simple Product",
    description: "Great product",
    image: DUMMY_IMAGE,
  },
};

export const LongDescription: Story = {
  args: {
    title: "Product with Long Description",
    description:
      "This is a product with an extensive description that exceeds the one hundred character limit specified in the design. When rendered, it should be truncated with an ellipsis to maintain a consistent card layout across the grid.",
    image: DUMMY_IMAGE,
  },
};

export const AtExactly250Chars: Story = {
  args: {
    title: "Boundary Test 250",
    description:
      "Exactly 250 characters: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo. Duis",
    image: DUMMY_IMAGE,
    maxDescriptionLength: 250,
  },
};

export const Minimal: Story = {
  args: {
    title: "Minimal",
    description: "Short",
    image: DUMMY_IMAGE,
  },
};

export const CustomMaxLength: Story = {
  args: {
    title: "Custom Truncation",
    description:
      "This description is truncated at 50 characters instead of the default 100.",
    image: DUMMY_IMAGE,
    maxDescriptionLength: 50,
  },
};
