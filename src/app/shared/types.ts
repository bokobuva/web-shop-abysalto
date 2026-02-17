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
