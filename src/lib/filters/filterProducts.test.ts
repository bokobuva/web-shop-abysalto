import type { Product } from "@/app/shared/types";

import {
  filterByCategory,
  filterByPriceRange,
  filterProducts,
} from "@/lib/filters/filterProducts";

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "1",
  name: "Test",
  price: 25,
  image: "",
  description: "",
  category: "beauty",
  ...overrides,
});

describe("filterByCategory", () => {
  it("returns true when categorySlug is null", () => {
    expect(filterByCategory(createProduct(), null)).toBe(true);
  });

  it("returns true when product category matches", () => {
    expect(
      filterByCategory(createProduct({ category: "beauty" }), "beauty"),
    ).toBe(true);
  });

  it("returns false when product category does not match", () => {
    expect(
      filterByCategory(createProduct({ category: "beauty" }), "furniture"),
    ).toBe(false);
  });
});

describe("filterByPriceRange", () => {
  it("returns true when priceRangeId is null", () => {
    expect(filterByPriceRange(createProduct(), null)).toBe(true);
  });

  it("filters 10-50 range correctly (10 <= price < 50)", () => {
    expect(filterByPriceRange(createProduct({ price: 10 }), "10-50")).toBe(
      true,
    );
    expect(filterByPriceRange(createProduct({ price: 49 }), "10-50")).toBe(
      true,
    );
    expect(filterByPriceRange(createProduct({ price: 50 }), "10-50")).toBe(
      false,
    );
    expect(filterByPriceRange(createProduct({ price: 9 }), "10-50")).toBe(
      false,
    );
    expect(filterByPriceRange(createProduct({ price: 51 }), "10-50")).toBe(
      false,
    );
  });

  it("filters 50-100 range correctly (50 <= price < 100)", () => {
    expect(filterByPriceRange(createProduct({ price: 50 }), "50-100")).toBe(
      true,
    );
    expect(filterByPriceRange(createProduct({ price: 99 }), "50-100")).toBe(
      true,
    );
    expect(filterByPriceRange(createProduct({ price: 75 }), "50-100")).toBe(
      true,
    );
    expect(filterByPriceRange(createProduct({ price: 49 }), "50-100")).toBe(
      false,
    );
    expect(filterByPriceRange(createProduct({ price: 100 }), "50-100")).toBe(
      false,
    );
  });

  it("filters 100+ range correctly", () => {
    expect(filterByPriceRange(createProduct({ price: 100 }), "100+")).toBe(
      true,
    );
    expect(filterByPriceRange(createProduct({ price: 500 }), "100+")).toBe(
      true,
    );
    expect(filterByPriceRange(createProduct({ price: 99 }), "100+")).toBe(
      false,
    );
  });
});

describe("filterProducts", () => {
  it("returns undefined when products is undefined", () => {
    expect(filterProducts(undefined, null, null)).toBeUndefined();
    expect(filterProducts(undefined, "beauty", null)).toBeUndefined();
  });

  const products = [
    createProduct({ id: "1", category: "beauty", price: 25 }),
    createProduct({ id: "2", category: "beauty", price: 75 }),
    createProduct({ id: "3", category: "furniture", price: 150 }),
  ];

  it("returns all products when no filters applied", () => {
    expect(filterProducts(products, null, null)).toHaveLength(3);
  });

  it("filters by category only", () => {
    const result = filterProducts(products, "beauty", null);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.category === "beauty")).toBe(true);
  });

  it("filters by price range only", () => {
    const result = filterProducts(products, null, "10-50");
    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(25);
  });

  it("filters by both category and price range", () => {
    const result = filterProducts(products, "beauty", "50-100");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("returns empty array when no products match", () => {
    const result = filterProducts(products, "groceries", "100+");
    expect(result).toHaveLength(0);
  });
});
