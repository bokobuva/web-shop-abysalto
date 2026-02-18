import { store } from "@/store";
import {
  setProducts,
  setCategory,
  setPriceRange,
  setCategories,
  setSortOption,
  setSearchQuery,
} from "@/store";
import type { RootState } from "@/store";
import {
  selectFilteredProducts,
  selectFilteredAndSortedProducts,
  selectProducts,
  selectCategories,
  selectFilters,
} from "@/store/selectors";

const mockProducts = [
  {
    id: "1",
    name: "Product A",
    price: 25,
    image: "",
    description: "",
    category: "beauty",
  },
  {
    id: "2",
    name: "Product B",
    price: 75,
    image: "",
    description: "",
    category: "furniture",
  },
];

describe("selectors", () => {
  beforeEach(() => {
    store.dispatch(setProducts(mockProducts));
    store.dispatch(setCategory(null));
    store.dispatch(setPriceRange(null));
    store.dispatch(setSortOption("default"));
    store.dispatch(setSearchQuery(""));
  });

  describe("selectFilteredProducts", () => {
    it("returns undefined when products.items is undefined", () => {
      const stateWithUndefinedProducts = {
        products: {
          items: undefined,
          isLoading: false,
          error: null,
        },
        categories: { items: undefined, isLoading: false, error: null },
        filters: { categorySlug: null, priceRangeId: null },
        sort: { sortOptionId: "default" as const },
        search: { searchQuery: "" },
      } as RootState;
      expect(
        selectFilteredProducts(stateWithUndefinedProducts),
      ).toBeUndefined();
    });

    it("returns all products when no filters", () => {
      const state = store.getState();
      expect(selectFilteredProducts(state)).toHaveLength(2);
    });

    it("filters by category when set", () => {
      store.dispatch(setCategory("beauty"));
      const state = store.getState();
      const result = selectFilteredProducts(state);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result![0].category).toBe("beauty");
    });

    it("filters by price range when set", () => {
      store.dispatch(setPriceRange("10-50"));
      const state = store.getState();
      const result = selectFilteredProducts(state);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result![0].price).toBe(25);
    });

    it("returns empty when no match", () => {
      store.dispatch(setCategory("groceries"));
      store.dispatch(setPriceRange("100+"));
      const state = store.getState();
      expect(selectFilteredProducts(state)).toHaveLength(0);
    });
  });

  describe("selectProducts and selectCategories", () => {
    it("selectProducts returns items", () => {
      const state = store.getState();
      expect(selectProducts(state)).toEqual(mockProducts);
    });

    it("selectCategories returns undefined when items is undefined", () => {
      const stateWithUndefinedCategories = {
        products: {
          items: mockProducts,
          isLoading: false,
          error: null,
        },
        categories: { items: undefined, isLoading: false, error: null },
        filters: { categorySlug: null, priceRangeId: null },
        sort: { sortOptionId: "default" as const },
        search: { searchQuery: "" },
      } as RootState;
      expect(selectCategories(stateWithUndefinedCategories)).toBeUndefined();
    });

    it("selectCategories returns items after dispatch", () => {
      const cats = [{ slug: "beauty", name: "Beauty" }];
      store.dispatch(
        setCategories(cats as Parameters<typeof setCategories>[0]),
      );
      const state = store.getState();
      expect(selectCategories(state)).toEqual(cats);
    });
  });

  describe("selectFilters", () => {
    it("returns current filter state", () => {
      store.dispatch(setCategory("beauty"));
      store.dispatch(setPriceRange("50-100"));
      const state = store.getState();
      expect(selectFilters(state)).toEqual({
        categorySlug: "beauty",
        priceRangeId: "50-100",
      });
    });
  });

  describe("selectFilteredAndSortedProducts", () => {
    it("returns undefined when products.items is undefined", () => {
      const stateWithUndefinedProducts = {
        products: {
          items: undefined,
          isLoading: false,
          error: null,
        },
        categories: { items: undefined, isLoading: false, error: null },
        filters: { categorySlug: null, priceRangeId: null },
        sort: { sortOptionId: "default" as const },
        search: { searchQuery: "" },
      } as RootState;
      expect(
        selectFilteredAndSortedProducts(stateWithUndefinedProducts),
      ).toBeUndefined();
    });

    it("returns filtered products in default order when sort is default", () => {
      const state = store.getState();
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result![0].name).toBe("Product A");
      expect(result![1].name).toBe("Product B");
    });

    it("sorts by price ascending when price-asc", () => {
      store.dispatch(setSortOption("price-asc"));
      const state = store.getState();
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toBeDefined();
      expect(result!.map((p) => p.price)).toEqual([25, 75]);
    });

    it("sorts by price descending when price-desc", () => {
      store.dispatch(setSortOption("price-desc"));
      const state = store.getState();
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toBeDefined();
      expect(result!.map((p) => p.price)).toEqual([75, 25]);
    });

    it("sorts by name A-Z when name-asc", () => {
      store.dispatch(setSortOption("name-asc"));
      const state = store.getState();
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toBeDefined();
      expect(result!.map((p) => p.name)).toEqual(["Product A", "Product B"]);
    });

    it("sorts by name Z-A when name-desc", () => {
      store.dispatch(setSortOption("name-desc"));
      const state = store.getState();
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toBeDefined();
      expect(result!.map((p) => p.name)).toEqual(["Product B", "Product A"]);
    });

    it("filters by search query when set", () => {
      store.dispatch(setSearchQuery("Product A"));
      const state = store.getState();
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result![0].name).toBe("Product A");
    });

    it("filters and sorts together", () => {
      store.dispatch(setCategory("beauty"));
      store.dispatch(setSortOption("price-desc"));
      const state = store.getState();
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result![0].name).toBe("Product A");
    });
  });
});
