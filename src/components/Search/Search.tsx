"use client";

import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { setSearchQuery } from "@/store/searchSlice";
import { useCallback } from "react";

export const Search: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery,
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch],
  );

  return (
    <div className="mb-4 flex flex-col">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
        Search
      </h2>
      <label htmlFor="search-products" className="sr-only">
        Search products by name
      </label>
      <input
        type="search"
        id="search-products"
        value={searchQuery}
        onChange={(e) => handleSearchInputChange(e)}
        placeholder="Search products by name"
        aria-label="Search products by name"
        data-testid="search-products"
        className="rounded-sm border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
      />
    </div>
  );
};
