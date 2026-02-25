import { useEffect } from "react";

import type { Product } from "@/app/shared/types";

export function useCloseProductModalWhenNotFound(
  selectedProductId: string | null,
  selectedProduct: Product | null,
  isLoading: boolean,
  closeProduct: () => void,
) {
  useEffect(() => {
    if (selectedProductId && !selectedProduct && !isLoading) {
      closeProduct();
    }
  }, [selectedProductId, selectedProduct, isLoading, closeProduct]);
}
