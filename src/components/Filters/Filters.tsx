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

import { Button } from "../Button";

export const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const { categorySlug, priceRangeId } = useSelector(selectFilters);

  const hasActiveFilters = categorySlug !== null || priceRangeId !== null;

  return (
    <section
      aria-label="Product filters"
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex flex-row flex-wrap items-end gap-6">
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Filter by category</legend>
          <label
            htmlFor="filter-category"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={categorySlug ?? ""}
            onChange={(e) => dispatch(setCategory(e.target.value || null))}
            aria-label="Select category to filter products"
            data-testid="filter-category"
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Filter by price range</legend>
          <span
            id="filter-price-label"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price range
          </span>
          <div
            role="group"
            aria-labelledby="filter-price-label"
            className="flex flex-row flex-wrap gap-4"
          >
            {PRICE_RANGES.map((range) => (
              <label
                key={range.id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  name="price-range"
                  value={range.id}
                  checked={priceRangeId === range.id}
                  onChange={() =>
                    dispatch(
                      setPriceRange(
                        priceRangeId === range.id
                          ? null
                          : (range.id as PriceRangeId),
                      ),
                    )
                  }
                  aria-label={`Price range: ${range.label}`}
                  data-testid={`filter-price-${range.id}`}
                  className="h-4 w-4"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {hasActiveFilters && (
          <Button
            label="Reset filters"
            onClick={() => dispatch(resetFilters())}
            dataTestId="filter-reset"
            ariaLabel="Clear all filters"
          />
        )}
      </div>
    </section>
  );
};
