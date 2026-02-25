"use client";

import { Filters } from "@/components/Filters";
import { Search } from "@/components/Search";
import { Sort } from "@/components/Sort";

export const Controls: React.FC = () => {
  return (
    <div className="flex w-full flex-col gap-6 sm:items-stretch sm:justify-between">
      <section
        aria-label="Search products"
        className="flex w-full flex-col gap-4 border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <Search />
      </section>
      <div className="flex w-full flex-col gap-6 border border-neutral-200 bg-white p-4 md:flex-row sm:items-stretch sm:justify-between dark:border-neutral-700 dark:bg-neutral-800">
        <Sort />
        <Filters />
      </div>
    </div>
  );
};
