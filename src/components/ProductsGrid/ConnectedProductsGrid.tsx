"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectPaginatedProducts,
  selectProductsError,
  selectProductsLoading,
  selectShowPagination,
  selectCurrentPage,
  selectTotalPages,
  selectCategorySlug,
  selectPriceRangeId,
  selectSearchQuery,
  selectSortOptionId,
  resetPagination,
  setCurrentPage,
} from "@/store";

import { Pagination } from "@/components/Pagination";
import { ProductsGrid } from "@/components/ProductsGrid";

export const ConnectedProductsGrid: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectPaginatedProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const showPagination = useSelector(selectShowPagination);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const categorySlug = useSelector(selectCategorySlug);
  const priceRangeId = useSelector(selectPriceRangeId);
  const searchQuery = useSelector(selectSearchQuery);
  const sortOptionId = useSelector(selectSortOptionId);

  useEffect(() => {
    dispatch(resetPagination());
  }, [dispatch, categorySlug, priceRangeId, searchQuery, sortOptionId]);

  return (
    <>
      <ProductsGrid
        products={isLoading ? undefined : products}
        error={error}
        onProductClick={(product) => {
          console.log("Product clicked:", product);
        }}
      />
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      )}
    </>
  );
};
