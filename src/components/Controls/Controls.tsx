"use client";

import { Filters } from "../Filters";
import { SortBy } from "../SortBy";

export const Controls: React.FC = () => {
  return (
    <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between">
      <Filters />
      <SortBy />
    </div>
  );
};
