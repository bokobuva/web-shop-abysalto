export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
};

export type Category = {
  slug: string;
  name: string;
};

export const PRICE_RANGES = [
  { id: "10-50", label: "$10 – $50", min: 10, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100+", label: "$100+", min: 100, max: Infinity },
] as const;

export type PriceRangeId = (typeof PRICE_RANGES)[number]["id"];

export const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
  { id: "name-desc", label: "Name: Z to A" },
] as const;

export type SortOptionId = (typeof SORT_OPTIONS)[number]["id"];

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
};

export type LoginCredentials = { username: string; password: string };

export type LoginResponse = AuthUser & {
  accessToken: string;
  refreshToken: string;
};
