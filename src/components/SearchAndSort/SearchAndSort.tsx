"use client";

import { useDispatch, useSelector } from "react-redux";

import { SORT_OPTIONS, type SortOptionId } from "@/app/shared/types";
import type { RootState } from "@/store";
import { setSearchQuery } from "@/store/searchSlice";
import { setSortOption } from "@/store/sortSlice";

export const SearchAndSort: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery,
  );
  const sortOptionId = useSelector(
    (state: RootState) => state.sort.sortOptionId,
  );

  return (
    <section
      aria-label="Search and sort products"
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 "
    >
      <h2 className="mb-3 text-md font-semibold text-gray-900 dark:text-zinc-50">
        Search
      </h2>
      <div className="flex flex-col gap-4 mb-4">
        <label htmlFor="search-products" className="sr-only">
          Search products by name
        </label>
        <input
          type="search"
          id="search-products"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search products by name"
          aria-label="Search products by name"
          data-testid="search-products"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

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
    </section>
  );
};
