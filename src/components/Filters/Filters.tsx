"use client";

import { useDispatch, useSelector } from "react-redux";

import { PRICE_RANGES } from "@/app/shared/constants";
import type { PriceRangeId } from "@/app/shared/types";
import { selectCategories, selectFilters } from "@/store/selectors";
import { setCategory, setPriceRange } from "@/store";
import { resetFilters } from "@/store/filtersSlice";

import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/icons";
import { useCallback } from "react";

export const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const { categorySlug, priceRangeId } = useSelector(selectFilters);

  const hasActiveFilters = categorySlug !== null || priceRangeId !== null;

  const handlePriceRangeSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPriceRange((e.target.value || null) as PriceRangeId | null));
    },
    [dispatch],
  );

  const handleFilterSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setCategory(e.target.value || null));
    },
    [dispatch],
  );

  const handleResetFilters = useCallback(() => {
    const categorySelect = document.getElementById("filter-category");
    if (categorySelect instanceof HTMLElement) {
      categorySelect.focus();
    }
    dispatch(resetFilters());
  }, [dispatch]);

  return (
    <section
      aria-label="Product filters"
      className="flex flex-1 min-h-0 flex-1 flex-col bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex w-full h-full flex-col gap-6 md:flex-row sm:flex-wrap">
        <fieldset className="flex shrink-0 flex-col gap-2">
          <legend className="sr-only">Filter by category</legend>
          {categories === undefined ? (
            <>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by category
              </span>
              <div
                role="status"
                aria-busy="true"
                aria-label="Loading categories"
                className="flex min-h-[42px] items-center"
              >
                <LoadingSpinner />
              </div>
            </>
          ) : (
            <>
              <label
                htmlFor="filter-category"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by category
              </label>
              <div className="flex min-h-[42px] w-full items-center">
                <select
                  id="filter-category"
                  value={categorySlug ?? ""}
                  onChange={(e) => handleFilterSelectChange(e)}
                  aria-label="Select category to filter products"
                  data-testid="filter-category"
                  className="w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => {
                    return (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          )}
        </fieldset>

        <fieldset className="flex shrink-0 flex-col gap-2">
          <legend className="sr-only">Filter by price range</legend>
          <label
            htmlFor="filter-price"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Filter by price range
          </label>
          <div className="flex min-h-[42px] w-full items-center">
            <select
              id="filter-price"
              value={priceRangeId ?? ""}
              onChange={(e) => handlePriceRangeSelectChange(e)}
              aria-label="Select price range to filter products"
              data-testid="filter-price"
              className="w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">All price ranges</option>
              {PRICE_RANGES.map((range) => {
                return (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                );
              })}
            </select>
          </div>
        </fieldset>

        {hasActiveFilters && (
          <div className="flex shrink-0 items-end">
            <Button
              onClick={handleResetFilters}
              dataTestId="filter-reset"
              ariaLabel="Clear all filters"
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
