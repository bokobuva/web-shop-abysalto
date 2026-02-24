import { getStoredCart, setStoredCart } from "../cartStorage";

const storage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(storage).forEach((k) => delete storage[k]);
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
    },
    writable: true,
    configurable: true,
  });
});

const validItem = {
  productId: "1",
  quantity: 2,
  name: "Product",
  price: 10,
  image: "",
};

describe("cartStorage", () => {
  describe("getStoredCart", () => {
    it("returns empty array when nothing stored", () => {
      expect(getStoredCart()).toEqual([]);
    });

    it("returns parsed items when valid JSON stored", () => {
      setStoredCart([validItem]);
      expect(getStoredCart()).toEqual([validItem]);
    });

    it("returns empty array when invalid JSON", () => {
      (
        window.localStorage as unknown as {
          setItem: (k: string, v: string) => void;
        }
      ).setItem("cart_items", "invalid");
      expect(getStoredCart()).toEqual([]);
    });

    it("filters invalid items", () => {
      setStoredCart([validItem, { invalid: "item" } as never]);
      const result = getStoredCart();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(validItem);
    });
  });

  describe("setStoredCart", () => {
    it("stores items", () => {
      setStoredCart([validItem]);
      expect(getStoredCart()).toEqual([validItem]);
    });
  });
});
