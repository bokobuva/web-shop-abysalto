"use client";

import { Suspense, useEffect } from "react";
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
} from "@/store/selectors";
import { resetPagination, setCurrentPage } from "@/store";

import { useProductModal } from "@/hooks/useProductModal";

import { Pagination } from "@/components/Pagination";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { ProductsGrid } from "@/components/ProductsGrid";

function ConnectedProductsGridInner() {
  const dispatch = useDispatch();
  const { product, selectedProductId, openProduct, closeProduct } =
    useProductModal();
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

  useEffect(() => {
    if (selectedProductId && !product && !isLoading) {
      closeProduct();
    }
  }, [selectedProductId, product, isLoading, closeProduct]);

  return (
    <>
      <ProductsGrid
        products={isLoading ? undefined : products}
        error={error}
        onProductClick={(p) => openProduct(p.id)}
      />
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      )}
      <ProductDetailsModal product={product} onClose={closeProduct} />
    </>
  );
}

export const ConnectedProductsGrid: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ConnectedProductsGridInner />
    </Suspense>
  );
};
