import type { Product } from "@/app/shared/types";

type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail?: string;
  images?: string[];
};

type DummyJsonResponse = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

function mapToProduct(dto: DummyJsonProduct): Product {
  return {
    id: String(dto.id),
    name: dto.title,
    price: dto.price,
    image: dto.thumbnail ?? dto.images?.[0] ?? "",
    description: dto.description,
    category: dto.category,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products");

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: DummyJsonResponse = await response.json();
  return data.products.map(mapToProduct);
}
