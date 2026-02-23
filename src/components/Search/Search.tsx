"use client";

import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { setSearchQuery } from "@/store/searchSlice";

export const Search: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery,
  );

  return (
    <div className="flex flex-col mb-4">
      <h2 className="mb-3 text-md font-semibold text-gray-900 dark:text-zinc-50">
        Search
      </h2>
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
  );
};
