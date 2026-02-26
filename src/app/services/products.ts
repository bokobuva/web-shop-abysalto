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

/**
 * Fetches products from DummyJSON, maps to Product type.
 * Throws when the response is not ok.
 */
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products");

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: DummyJsonResponse = await response.json();
  return data.products.map(mapToProduct);
}

/**
 * Fetches products from DummyJSON search API, maps to Product type, and filters
 * to only products whose title contains the query (case-insensitive).
 * Throws when the response is not ok.
 */
export async function fetchSearchProducts(query: string): Promise<Product[]> {
  const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch search products: ${response.statusText}`);
  }

  const data: DummyJsonResponse = await response.json();
  const products = data.products.map(mapToProduct);
  const trimmed = query.trim().toLowerCase();
  const filtered =
    trimmed === ""
      ? products
      : products.filter((p) => p.name.toLowerCase().includes(trimmed));
  return filtered;
}
