export const PAGE_SIZE = 20;
export const PRODUCT_QUERY_PARAM = "product";
export const ACCESS_TOKEN_KEY = "auth_access_token";
export const REFRESH_TOKEN_KEY = "auth_refresh_token";
export const CART_KEY = "cart_items";
export const DROPDOWN_HOVER_DELAY_MS = 100;

export const PRICE_RANGES = [
  { id: "10-50", label: "$10 – $50", min: 10, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100+", label: "$100+", min: 100, max: Infinity },
] as const;

export const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  {
    id: "price-asc",
    label: "Price: Low to High",
    sortBy: "price" as const,
    order: "asc" as const,
  },
  {
    id: "price-desc",
    label: "Price: High to Low",
    sortBy: "price" as const,
    order: "desc" as const,
  },
  {
    id: "name-asc",
    label: "Name: A to Z",
    sortBy: "name" as const,
    order: "asc" as const,
  },
  {
    id: "name-desc",
    label: "Name: Z to A",
    sortBy: "name" as const,
    order: "desc" as const,
  },
] as const;
