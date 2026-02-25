"use client";

import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/HeroBanner";
import { NavBar } from "@/components/NavBar";
import { ValuePropositionBar } from "@/components/ValuePropositionBar";
import { Controls } from "@/components/Controls";
import { ConnectedProductsGrid } from "@/components/ProductsGrid/ConnectedProductsGrid";
import { useSyncProductsToRedux } from "@/hooks/useSyncProductsToRedux";

export default function Home() {
  useSyncProductsToRedux();

  return (
    <div className="min-h-screen bg-white font-sans dark:bg-neutral-950  bg-neutral-100">
      <header className="sticky top-0 z-40 bg-neutral-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-medium tracking-widest uppercase text-white sm:text-2xl">
            Web Shop
          </h1>
          <NavBar />
        </div>
      </header>
      <HeroBanner />
      <ValuePropositionBar />
      <main
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 "
        role="main"
      >
        <h2 className="mb-8 text-2xl font-medium uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
          Our Collection
        </h2>
        <Controls />
        <div id="products" className="mt-8">
          <ConnectedProductsGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
