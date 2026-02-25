"use client";

import { useDispatch, useSelector } from "react-redux";

import { SORT_OPTIONS } from "@/app/shared/constants";
import type { SortOptionId } from "@/app/shared/types";
import type { RootState } from "@/store";
import { setSortOption } from "@/store/sortSlice";
import { useCallback } from "react";

export const Sort: React.FC = () => {
  const dispatch = useDispatch();
  const sortOptionId = useSelector(
    (state: RootState) => state.sort.sortOptionId,
  );

  const handleSortSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortOption(e.target.value as SortOptionId));
    },
    [dispatch],
  );

  return (
    <section aria-label="Sort products" className="flex flex-col gap-2">
      <span className="text-sm font-medium uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
        Sort by
      </span>
      <label htmlFor="sort-by" className="sr-only">
        Sort products by
      </label>
      <select
        id="sort-by"
        value={sortOptionId}
        onChange={(e) => handleSortSelectChange(e)}
        aria-label="Select sort order"
        data-testid="sort-by"
        className="cursor-pointer rounded-sm border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
      >
        {SORT_OPTIONS.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          );
        })}
      </select>
    </section>
  );
};
