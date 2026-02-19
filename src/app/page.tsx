"use client";

import { AuthBar } from "@/components/AuthBar";
import { Controls } from "@/components/Controls";
import { ConnectedProductsGrid } from "@/components/ProductsGrid/ConnectedProductsGrid";
import { useSyncProductsToRedux } from "@/hooks/useSyncProductsToRedux";

export default function Home() {
  useSyncProductsToRedux();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-black/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-2xl">
            Abysalto&apos;s Web Shop
          </h1>
          <AuthBar />
        </div>
      </header>
      <main
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        role="main"
      >
        <h2 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Products
        </h2>
        <Controls />
        <div className="mt-8">
          <ConnectedProductsGrid />
        </div>
      </main>
    </div>
  );
}
