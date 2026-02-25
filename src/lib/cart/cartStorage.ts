import { CART_KEY } from "@/app/shared/constants";

import type { CartItem } from "@/app/shared/types";

/**
 * Returns cart items from localStorage, validated against CartItem shape.
 * Returns empty array on SSR, missing data, invalid JSON, or invalid items.
 */
export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.image === "string",
    );
  } catch {
    return [];
  }
}

/**
 * Persists cart items to localStorage under CART_KEY.
 * No-op when window is undefined (SSR).
 */
export function setStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
