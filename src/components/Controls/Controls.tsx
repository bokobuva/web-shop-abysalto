"use client";

import { Filters } from "@/components/Filters";
import { SearchAndSort } from "@/components/SearchAndSort";

export const Controls: React.FC = () => {
  return (
    <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between">
      <SearchAndSort />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Filters />
      </div>
    </div>
  );
};
