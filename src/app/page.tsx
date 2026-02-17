"use client";

import { useQuery } from "@tanstack/react-query";

import { ProductsGrid } from "@/components/ProductsGrid";
import { fetchProducts } from "@/app/api/products";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Abysalto&apos;s Web Shop
        </h1>
        <ProductsGrid
          products={isLoading ? undefined : (data ?? [])}
          error={isError && error instanceof Error ? error.message : null}
          onProductClick={(product) => {
            console.log("Product clicked:", product);
          }}
        />
      </main>
    </div>
  );
}
