import { cartReducer } from "@/store/cartSlice";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCart,
} from "@/store/cartSlice";

import type { Product } from "@/app/shared/types";

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "1",
  name: "Test Product",
  price: 25,
  image: "",
  description: "",
  category: "beauty",
  ...overrides,
});

describe("cartSlice", () => {
  const initialState = { items: [] };

  it("has correct initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("addToCart adds new item", () => {
    const product = createProduct();
    const state = cartReducer(
      initialState,
      addToCart({ product, quantity: 2 }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({
      productId: "1",
      quantity: 2,
      name: "Test Product",
      price: 25,
      image: "",
    });
  });

  it("addToCart increments quantity for existing product", () => {
    const product = createProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 2 }));
    state = cartReducer(state, addToCart({ product, quantity: 3 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5);
  });

  it("updateQuantity updates item", () => {
    const product = createProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 5 }));
    state = cartReducer(
      state,
      updateQuantity({ productId: "1", quantity: 10 }),
    );
    expect(state.items[0].quantity).toBe(10);
  });

  it("updateQuantity removes item when quantity is 0", () => {
    const product = createProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 2 }));
    state = cartReducer(state, updateQuantity({ productId: "1", quantity: 0 }));
    expect(state.items).toHaveLength(0);
  });

  it("removeFromCart removes item", () => {
    const product = createProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 1 }));
    state = cartReducer(state, removeFromCart({ productId: "1" }));
    expect(state.items).toHaveLength(0);
  });

  it("clearCart resets to empty", () => {
    const product = createProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 1 }));
    state = cartReducer(state, clearCart());
    expect(state.items).toEqual([]);
  });

  it("setCart replaces items", () => {
    const items = [
      {
        productId: "1",
        quantity: 2,
        name: "A",
        price: 10,
        image: "",
      },
    ];
    const state = cartReducer(initialState, setCart(items));
    expect(state.items).toEqual(items);
  });
});
