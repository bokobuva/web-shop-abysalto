import { createSlice } from "@reduxjs/toolkit";

import type { CartItem, Product } from "@/app/shared/types";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    quantity,
    name: product.name,
    price: product.price,
    image: product.image,
  };
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: { payload: { product: Product; quantity: number } },
    ) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push(toCartItem(product, quantity));
      }
    },
    updateQuantity: (
      state,
      action: { payload: { productId: string; quantity: number } },
    ) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.quantity = quantity;
      }
    },
    removeFromCart: (state, action: { payload: { productId: string } }) => {
      state.items = state.items.filter(
        (i) => i.productId !== action.payload.productId,
      );
    },
    clearCart: () => initialState,
    setCart: (state, action: { payload: CartItem[] }) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, setCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
