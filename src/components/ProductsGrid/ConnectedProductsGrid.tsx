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

import { LoadingSpinner } from "@/components/icons";
import { Pagination } from "@/components/Pagination";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { ProductsGrid } from "@/components/ProductsGrid";

function ConnectedProductsGridInner() {
  const dispatch = useDispatch();
  const { selectedProduct, selectedProductId, openProduct, closeProduct } =
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
    if (selectedProductId && !selectedProduct && !isLoading) {
      closeProduct();
    }
  }, [selectedProductId, selectedProduct, isLoading, closeProduct]);

  const productsToShow = isLoading ? undefined : products;

  return (
    <>
      <ProductsGrid
        products={productsToShow}
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
      <ProductDetailsModal product={selectedProduct} onClose={closeProduct} />
    </>
  );
}

export const ConnectedProductsGrid: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading products"
          className="flex min-h-[200px] items-center justify-center"
        >
          <LoadingSpinner />
        </div>
      }
    >
      <ConnectedProductsGridInner />
    </Suspense>
  );
};
