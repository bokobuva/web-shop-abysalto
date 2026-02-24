"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { PRODUCT_QUERY_PARAM } from "@/app/shared/constants";

import type { RootState } from "@/store";
import { selectProductById } from "@/store/selectors";

export function useProductModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedProductId = useMemo(
    () => searchParams.get(PRODUCT_QUERY_PARAM),
    [searchParams],
  );

  const selectedProduct = useSelector((state: RootState) =>
    selectProductById(state, selectedProductId),
  );

  const openProduct = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PRODUCT_QUERY_PARAM, id);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const closeProduct = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PRODUCT_QUERY_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  return {
    selectedProductId,
    selectedProduct,
    openProduct,
    closeProduct,
  };
}
