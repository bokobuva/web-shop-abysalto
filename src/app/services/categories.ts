import type { Category } from "@/app/shared/types";

type DummyJsonCategory = {
  slug: string;
  name: string;
  url?: string;
};

/**
 * Fetches categories from DummyJSON, maps to Category type (slug, name).
 * Throws when the response is not ok.
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("https://dummyjson.com/products/categories");

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const data: DummyJsonCategory[] = await response.json();
  return data.map((c) => ({ slug: c.slug, name: c.name }));
}
