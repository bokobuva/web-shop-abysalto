"use client";

import { Filters } from "@/components/Filters";
import { Search } from "@/components/Search";
import { Sort } from "@/components/Sort";

export const Controls: React.FC = () => {
  return (
    <div className="flex w-full flex-col gap-6 sm:items-stretch sm:justify-between">
      <section
        aria-label="Search products"
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 flex gap-4 flex-col w-full"
      >
        <Search />
      </section>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900  gap-6 flex w-full flex-col gap-6 md:flex-row sm:items-stretch sm:justify-between">
        <Sort />
        <Filters />
      </div>
    </div>
  );
};
