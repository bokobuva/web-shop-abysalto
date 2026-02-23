"use client";

import { useEffect } from "react";
import { useStore } from "react-redux";

import { getStoredCart, setStoredCart } from "@/lib/cart/cartStorage";

import { setCart } from "@/store";
import type { RootState } from "@/store";

export function CartPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useStore<RootState>();

  useEffect(() => {
    const items = getStoredCart();
    if (items.length > 0) {
      store.dispatch(setCart(items));
    }
  }, [store]);

  useEffect(() => {
    return store.subscribe(() => {
      const state = store.getState();
      setStoredCart(state.cart.items);
    });
  }, [store]);

  return <>{children}</>;
}
