import { fetchProducts, fetchSearchProducts } from "@/app/services/products";

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockClear();
});

describe("fetchProducts", () => {
  it("returns mapped products on successful fetch", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Test Product",
        description: "Test description",
        category: "beauty",
        price: 9.99,
        thumbnail: "https://example.com/image.webp",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: mockProducts,
        total: 1,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchProducts();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "1",
      name: "Test Product",
      price: 9.99,
      image: "https://example.com/image.webp",
      description: "Test description",
      category: "beauty",
    });
  });

  it("uses images[0] when thumbnail is missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 2,
            title: "No Thumbnail",
            description: "Desc",
            category: "beauty",
            price: 19.99,
            images: ["https://example.com/fallback.webp"],
          },
        ],
        total: 1,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchProducts();

    expect(result[0].image).toBe("https://example.com/fallback.webp");
  });

  it("uses empty string for image when thumbnail and images are missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 3,
            title: "No Image",
            description: "Desc",
            category: "beauty",
            price: 5.99,
          },
        ],
        total: 1,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchProducts();

    expect(result[0].image).toBe("");
  });

  it("throws when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(fetchProducts()).rejects.toThrow(
      "Failed to fetch products: Internal Server Error",
    );
  });

  it("returns empty array when API returns no products", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        total: 0,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchProducts();

    expect(result).toEqual([]);
  });

  it("maps multiple products correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 10,
            title: "Product A",
            description: "Desc A",
            category: "fragrances",
            price: 49.99,
            thumbnail: "https://cdn.example.com/a.webp",
          },
          {
            id: 11,
            title: "Product B",
            description: "Desc B",
            category: "furniture",
            price: 199.99,
            thumbnail: "https://cdn.example.com/b.webp",
          },
        ],
        total: 2,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchProducts();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("10");
    expect(result[0].name).toBe("Product A");
    expect(result[1].id).toBe("11");
    expect(result[1].name).toBe("Product B");
  });
});

describe("fetchSearchProducts", () => {
  it("fetches with encoded query in URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: [], total: 0, skip: 0, limit: 30 }),
    });

    await fetchSearchProducts("phone case");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?q=phone%20case",
    );
  });

  it("returns mapped products on successful fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 101,
            title: "iPhone Case",
            description: "Protective case",
            category: "mobile-accessories",
            price: 29.99,
            thumbnail: "https://example.com/case.webp",
          },
        ],
        total: 1,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchSearchProducts("phone");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "101",
      name: "iPhone Case",
      price: 29.99,
      image: "https://example.com/case.webp",
      description: "Protective case",
      category: "mobile-accessories",
    });
  });

  it("throws when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
    });

    await expect(fetchSearchProducts("x")).rejects.toThrow(
      "Failed to fetch search products: Bad Request",
    );
  });

  it("returns only products whose title contains the query", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 1,
            title: "Beef Steak",
            description: "Contains beef in description",
            category: "groceries",
            price: 12.99,
          },
          {
            id: 2,
            title: "Cucumber",
            description: "Fresh vegetable, no beef",
            category: "groceries",
            price: 1.49,
          },
          {
            id: 3,
            title: "Beef Jerky",
            description: "Dried beef",
            category: "groceries",
            price: 8.99,
          },
        ],
        total: 3,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchSearchProducts("beef");

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(["Beef Steak", "Beef Jerky"]);
    expect(result.find((p) => p.name === "Cucumber")).toBeUndefined();
  });

  it("filters by title case-insensitively", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 1,
            title: "iPhone Case",
            description: "Case",
            category: "mobile-accessories",
            price: 29.99,
          },
          {
            id: 2,
            title: "PHONE Stand",
            description: "Stand",
            category: "mobile-accessories",
            price: 19.99,
          },
        ],
        total: 2,
        skip: 0,
        limit: 30,
      }),
    });

    const result = await fetchSearchProducts("PHONE");

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(["iPhone Case", "PHONE Stand"]);
  });
});
