import type { PRICE_RANGES } from "@/app/shared/constants";
import type { SORT_OPTIONS } from "@/app/shared/constants";

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

export type PriceRangeId = (typeof PRICE_RANGES)[number]["id"];
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

export type CartItem = {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
};
