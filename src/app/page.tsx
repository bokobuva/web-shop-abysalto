"use client";

import { Filters } from "@/components/Filters";
import { ConnectedProductsGrid } from "@/components/ProductsGrid/ConnectedProductsGrid";
import { useSyncProductsToRedux } from "@/hooks/useSyncProductsToRedux";

export default function Home() {
  useSyncProductsToRedux();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        role="main"
      >
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Abysalto&apos;s Web Shop
        </h1>
        <Filters />
        <div className="mt-8">
          <ConnectedProductsGrid />
        </div>
      </main>
    </div>
  );
}
