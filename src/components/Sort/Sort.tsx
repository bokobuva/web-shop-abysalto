"use client";

import { useDispatch, useSelector } from "react-redux";

import { SORT_OPTIONS, type SortOptionId } from "@/app/shared/types";
import type { RootState } from "@/store";
import { setSortOption } from "@/store/sortSlice";

export const Sort: React.FC = () => {
  const dispatch = useDispatch();
  const sortOptionId = useSelector(
    (state: RootState) => state.sort.sortOptionId,
  );

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-md font-semibold text-gray-900 dark:text-zinc-50">
        Sort
      </h2>
      <label htmlFor="sort-by" className="sr-only">
        Sort products by
      </label>
      <select
        id="sort-by"
        value={sortOptionId}
        onChange={(e) =>
          dispatch(setSortOption(e.target.value as SortOptionId))
        }
        aria-label="Select sort order"
        data-testid="sort-by"
        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
