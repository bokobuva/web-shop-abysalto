"use client";

const ITEMS = [
  "FREE SHIPPING",
  "FREE RETURNS",
  "GENUINE PRODUCT GUARANTEE",
  "SECURE SHOPPING",
] as const;

export const ValuePropositionBar: React.FC = () => {
  return (
    <div
      className="border-b border-neutral-200 bg-white py-4 dark:border-neutral-700 dark:bg-neutral-800"
      role="region"
      aria-label="Value propositions"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        {ITEMS.map((item, index) => (
          <span key={item} className="flex items-center gap-x-4 sm:gap-x-6">
            {index > 0 && (
              <span
                aria-hidden
                className="text-neutral-300 dark:text-neutral-600"
              >
                |
              </span>
            )}
            <span className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
