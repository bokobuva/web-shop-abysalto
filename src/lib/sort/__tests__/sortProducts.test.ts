import type { Product } from "@/app/shared/types";

import { sortProducts } from "@/lib/sort/sortProducts";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Zebra",
    price: 100,
    image: "",
    description: "",
    category: "a",
  },
  {
    id: "2",
    name: "Apple",
    price: 25,
    image: "",
    description: "",
    category: "a",
  },
  {
    id: "3",
    name: "Mango",
    price: 50,
    image: "",
    description: "",
    category: "a",
  },
];

describe("sortProducts", () => {
  it("returns same order for default", () => {
    const result = sortProducts(mockProducts, "default");
    expect(result).toBeDefined();
    expect(result).toEqual(mockProducts);
    expect(result![0].name).toBe("Zebra");
    expect(result![1].name).toBe("Apple");
    expect(result![2].name).toBe("Mango");
  });

  it("sorts by price ascending (low to high)", () => {
    const result = sortProducts(mockProducts, "price-asc");
    expect(result).toBeDefined();
    expect(result!.map((p) => p.price)).toEqual([25, 50, 100]);
    expect(result!.map((p) => p.name)).toEqual(["Apple", "Mango", "Zebra"]);
  });

  it("sorts by price descending (high to low)", () => {
    const result = sortProducts(mockProducts, "price-desc");
    expect(result).toBeDefined();
    expect(result!.map((p) => p.price)).toEqual([100, 50, 25]);
    expect(result!.map((p) => p.name)).toEqual(["Zebra", "Mango", "Apple"]);
  });

  it("sorts by name A to Z", () => {
    const result = sortProducts(mockProducts, "name-asc");
    expect(result).toBeDefined();
    expect(result!.map((p) => p.name)).toEqual(["Apple", "Mango", "Zebra"]);
  });

  it("sorts by name Z to A", () => {
    const result = sortProducts(mockProducts, "name-desc");
    expect(result).toBeDefined();
    expect(result!.map((p) => p.name)).toEqual(["Zebra", "Mango", "Apple"]);
  });

  it("does not mutate input array", () => {
    const copy = [...mockProducts];
    sortProducts(mockProducts, "price-asc");
    expect(mockProducts).toEqual(copy);
  });

  it("returns empty array when input is empty", () => {
    expect(sortProducts([], "price-asc")).toEqual([]);
  });

  it("returns undefined when products is undefined", () => {
    expect(sortProducts(undefined, "price-asc")).toBeUndefined();
  });
});
