import { fetchCategories } from "./categories";

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockClear();
});

describe("fetchCategories", () => {
  it("returns mapped categories on successful fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { slug: "beauty", name: "Beauty" },
        { slug: "furniture", name: "Furniture" },
      ],
    });

    const result = await fetchCategories();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ slug: "beauty", name: "Beauty" });
    expect(result[1]).toEqual({ slug: "furniture", name: "Furniture" });
  });

  it("throws when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Server Error",
    });

    await expect(fetchCategories()).rejects.toThrow(
      "Failed to fetch categories: Server Error",
    );
  });

  it("returns empty array when API returns no categories", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await fetchCategories();

    expect(result).toEqual([]);
  });
});
