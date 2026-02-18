import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import type { Product } from "@/app/shared/types";

import { ProductsGrid } from "@/components/ProductsGrid";

const meta = {
  title: "Components/ProductsGrid",
  component: ProductsGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    products: { control: false },
    error: { control: "text" },
    onProductClick: { action: "productClicked" },
  },
} satisfies Meta<typeof ProductsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const DUMMY_IMAGE =
  "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Essence Mascara Lash Princess",
    price: 9.99,
    image: DUMMY_IMAGE,
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
    category: "beauty",
  },
  {
    id: "2",
    name: "Eyeshadow Palette with Mirror",
    price: 19.99,
    image:
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
    description:
      "Offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror.",
    category: "beauty",
  },
  {
    id: "3",
    name: "Powder Canister",
    price: 14.99,
    image:
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
    description:
      "A finely milled setting powder designed to set makeup and control shine. Lightweight and translucent.",
    category: "beauty",
  },
];

const manyProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
  ...mockProducts[i % 3],
  id: String(i + 1),
  name: `${mockProducts[i % 3].name} ${i + 1}`,
}));

export const Loading: Story = {
  args: {
    products: undefined,
    error: undefined,
  },
};

export const Empty: Story = {
  args: {
    products: [],
    error: undefined,
  },
};

export const Error: Story = {
  args: {
    products: undefined,
    error: "Failed to fetch products. Network error occurred.",
  },
};

export const ErrorWithProducts: Story = {
  args: {
    products: mockProducts,
    error: "API returned an error after partial load",
  },
};

export const SingleProduct: Story = {
  args: {
    products: [mockProducts[0]],
    error: undefined,
    onProductClick: fn(),
  },
};

export const MultipleProducts: Story = {
  args: {
    products: mockProducts,
    error: undefined,
    onProductClick: fn(),
  },
};

export const ManyProducts: Story = {
  args: {
    products: manyProducts,
    error: undefined,
    onProductClick: fn(),
  },
};
