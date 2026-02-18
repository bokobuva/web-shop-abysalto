import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import type { Product } from "@/app/shared/types";

import { ProductDetailsModal } from "./ProductDetailsModal";

const meta = {
  title: "Components/ProductDetailsModal",
  component: ProductDetailsModal,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof ProductDetailsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProduct: Product = {
  id: "1",
  name: "Essence Mascara Lash Princess",
  price: 9.99,
  image:
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  description:
    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. It creates dramatic lashes with a single stroke and has a creamy formula that glides on smoothly without clumping. Suitable for sensitive eyes and contact lens wearers.",
  category: "beauty",
};

export const WithoutProduct: Story = {
  args: {
    product: null,
    onClose: fn(),
  },
};

export const WithProduct: Story = {
  args: {
    product: mockProduct,
    onClose: fn(),
  },
};
