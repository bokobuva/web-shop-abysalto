"use client";

import { Filters } from "@/components/Filters";
import { SortBy } from "@/components/SortBy";

export const Controls: React.FC = () => {
  return (
    <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between">
      <div className="min-w-0 flex-1">
        <Filters />
      </div>
      <SortBy />
    </div>
  );
};
