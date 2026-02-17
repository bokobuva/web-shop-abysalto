import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchCategories } from "@/app/api/categories";
import { fetchProducts } from "@/app/api/products";
import {
  setCategories,
  setCategoriesError,
  setCategoriesLoading,
  setProducts,
  setProductsError,
  setProductsLoading,
} from "@/store";

export function useSyncProductsToRedux() {
  const dispatch = useDispatch();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (productsQuery.isLoading) {
      dispatch(setProductsLoading());
    } else if (productsQuery.isError && productsQuery.error) {
      dispatch(
        setProductsError(
          productsQuery.error instanceof Error
            ? productsQuery.error.message
            : "Failed to load products",
        ),
      );
    } else if (productsQuery.data) {
      dispatch(setProducts(productsQuery.data));
    }
  }, [
    dispatch,
    productsQuery.isLoading,
    productsQuery.isError,
    productsQuery.error,
    productsQuery.data,
  ]);

  useEffect(() => {
    if (categoriesQuery.isLoading) {
      dispatch(setCategoriesLoading());
    } else if (categoriesQuery.isError && categoriesQuery.error) {
      dispatch(
        setCategoriesError(
          categoriesQuery.error instanceof Error
            ? categoriesQuery.error.message
            : "Failed to load categories",
        ),
      );
    } else if (categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [
    dispatch,
    categoriesQuery.isLoading,
    categoriesQuery.isError,
    categoriesQuery.error,
    categoriesQuery.data,
  ]);

  return {
    productsLoading: productsQuery.isLoading,
    productsError: productsQuery.error,
    categoriesLoading: categoriesQuery.isLoading,
    categoriesError: categoriesQuery.error,
  };
}
