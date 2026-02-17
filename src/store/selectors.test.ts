import { filterProducts } from "@/lib/filters/filterProducts";

import { store } from "./index";
import {
  setProducts,
  setCategory,
  setPriceRange,
  setCategories,
} from "./index";
import {
  selectFilteredProducts,
  selectProducts,
  selectCategories,
  selectFilters,
} from "./selectors";

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
  });

  describe("selectFilteredProducts", () => {
    it("returns all products when no filters", () => {
      const state = store.getState();
      expect(selectFilteredProducts(state)).toHaveLength(2);
    });

    it("filters by category when set", () => {
      store.dispatch(setCategory("beauty"));
      const state = store.getState();
      const result = selectFilteredProducts(state);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("beauty");
    });

    it("filters by price range when set", () => {
      store.dispatch(setPriceRange("10-50"));
      const state = store.getState();
      const result = selectFilteredProducts(state);
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(25);
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
});
