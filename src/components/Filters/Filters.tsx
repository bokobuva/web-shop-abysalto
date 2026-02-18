"use client";

import { useDispatch, useSelector } from "react-redux";

import { PRICE_RANGES, type PriceRangeId } from "@/app/shared/types";
import {
  selectCategories,
  selectFilters,
  setCategory,
  setPriceRange,
} from "@/store";
import { resetFilters } from "@/store/filtersSlice";

import { Button } from "@/components/Button";

export const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const { categorySlug, priceRangeId } = useSelector(selectFilters);

  const hasActiveFilters = categorySlug !== null || priceRangeId !== null;

  const handleResetFilters = () => {
    const categorySelect = document.getElementById("filter-category");
    if (categorySelect instanceof HTMLElement) {
      categorySelect.focus();
    }
    dispatch(resetFilters());
  };

  return (
    <section
      aria-label="Product filters"
      className="flex h-full min-h-0 flex-1 flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-zinc-50">
        Filters
      </h2>
      <div className="flex w-full flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <fieldset className="flex shrink-0 flex-col gap-2">
          <legend className="sr-only">Filter by category</legend>
          <label
            htmlFor="filter-category"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Category
          </label>
          {categories === undefined ? (
            <div
              role="status"
              aria-busy="true"
              aria-label="Loading categories"
              className="flex min-h-[42px] items-center"
            >
              <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800 dark:border-gray-700 dark:border-t-gray-200"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="flex min-h-[42px] w-full items-center">
              <select
                id="filter-category"
                value={categorySlug ?? ""}
                onChange={(e) => dispatch(setCategory(e.target.value || null))}
                aria-label="Select category to filter products"
                data-testid="filter-category"
                className="w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </fieldset>

        <fieldset className="flex shrink-0 flex-col gap-2">
          <legend className="sr-only">Filter by price range</legend>
          <span
            id="filter-price-label"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price range
          </span>
          <div
            role="radiogroup"
            aria-labelledby="filter-price-label"
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            {PRICE_RANGES.map((range) => {
              const isChecked = priceRangeId === range.id;
              const handleSelect = () =>
                dispatch(
                  setPriceRange(isChecked ? null : (range.id as PriceRangeId)),
                );
              return (
                <button
                  key={range.id}
                  type="button"
                  role="radio"
                  aria-checked={isChecked}
                  aria-label={`Price range: ${range.label}`}
                  data-testid={`filter-price-${range.id}`}
                  tabIndex={0}
                  onClick={handleSelect}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect();
                    }
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <span
                    aria-hidden
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      isChecked
                        ? "border-gray-600 bg-gray-600 dark:border-gray-400 dark:bg-gray-400"
                        : "border-gray-400 dark:border-gray-500"
                    }`}
                  />
                  <span className="text-sm">{range.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {hasActiveFilters && (
          <div className="flex shrink-0 items-center">
            <Button
              label="Reset filters"
              onClick={handleResetFilters}
              dataTestId="filter-reset"
              ariaLabel="Clear all filters"
            />
          </div>
        )}
      </div>
    </section>
  );
};
