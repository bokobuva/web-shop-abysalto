import type { Product } from "@/app/shared/types";

import { searchProducts } from "../searchProducts";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Apple Watch",
    price: 100,
    image: "",
    description: "",
    category: "tech",
  },
  {
    id: "2",
    name: "Banana Smoothie",
    price: 5,
    image: "",
    description: "",
    category: "food",
  },
  {
    id: "3",
    name: "Cherry Blossom",
    price: 25,
    image: "",
    description: "",
    category: "beauty",
  },
];

describe("searchProducts", () => {
  it("returns undefined when products is undefined", () => {
    expect(searchProducts(undefined, "")).toBeUndefined();
    expect(searchProducts(undefined, "apple")).toBeUndefined();
  });

  it("returns all products when searchQuery is empty", () => {
    expect(searchProducts(mockProducts, "")).toEqual(mockProducts);
    expect(searchProducts(mockProducts, "   ")).toEqual(mockProducts);
  });

  it("filters by name case-insensitively", () => {
    const result = searchProducts(mockProducts, "apple");
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result![0]!.name).toBe("Apple Watch");
    expect(searchProducts(mockProducts, "APPLE")).toHaveLength(1);
    expect(searchProducts(mockProducts, "Banana")).toHaveLength(1);
  });

  it("filters by partial match", () => {
    const result = searchProducts(mockProducts, "erry");
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result![0]!.name).toBe("Cherry Blossom");
  });

  it("trims search query", () => {
    expect(searchProducts(mockProducts, "  apple  ")).toHaveLength(1);
    expect(searchProducts(mockProducts, "  ")).toEqual(mockProducts);
  });

  it("returns empty array when no match", () => {
    expect(searchProducts(mockProducts, "xyz")).toEqual([]);
  });
});
