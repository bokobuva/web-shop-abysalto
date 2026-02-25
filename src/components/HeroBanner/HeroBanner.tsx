"use client";

import Link from "next/link";

export const HeroBanner: React.FC = () => {
  return (
    <section
      className="flex min-h-[320px] flex-col items-center justify-center bg-neutral-100 px-4 py-16 dark:bg-neutral-200"
      aria-label="Hero"
    >
      <h2 className="text-center text-3xl font-medium tracking-widest text-neutral-900 sm:text-4xl">
        DISCOVER OUR COLLECTION
      </h2>
      <p className="mt-3 max-w-md text-center text-sm text-neutral-600">
        Curated products for the discerning shopper
      </p>
      <Link
        href="#products"
        className="mt-6 inline-block rounded-sm border border-neutral-800 px-8 py-2.5 font-medium tracking-wide text-neutral-900 transition-colors hover:bg-neutral-800 hover:text-white"
        aria-label="Scroll to product collection"
      >
        SHOP NOW
      </Link>
    </section>
  );
};
