"use client";

import { useSelector } from "react-redux";

import {
  selectFilteredAndSortedProducts,
  selectProductsError,
  selectProductsLoading,
} from "@/store";

import { ProductsGrid } from "./ProductsGrid";

export const ConnectedProductsGrid: React.FC = () => {
  const products = useSelector(selectFilteredAndSortedProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  return (
    <ProductsGrid
      products={isLoading ? undefined : products}
      error={error}
      onProductClick={(product) => {
        console.log("Product clicked:", product);
      }}
    />
  );
};
