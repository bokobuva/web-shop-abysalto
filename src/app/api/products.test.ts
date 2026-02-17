import { fetchProducts } from "./products";

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
