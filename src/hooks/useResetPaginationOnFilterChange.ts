import { useEffect } from "react";
import { useDispatch } from "react-redux";

import type { SortOptionId } from "@/app/shared/types";

import { resetPagination } from "@/store";

type UseResetPaginationOnFilterChangeDeps = {
  categorySlug: string | null;
  priceRangeId: string | null;
  searchQuery: string;
  sortOptionId: SortOptionId;
};

export function useResetPaginationOnFilterChange(
  deps: UseResetPaginationOnFilterChangeDeps,
) {
  const dispatch = useDispatch();
  const { categorySlug, priceRangeId, searchQuery, sortOptionId } = deps;

  useEffect(() => {
    dispatch(resetPagination());
  }, [dispatch, categorySlug, priceRangeId, searchQuery, sortOptionId]);
}
