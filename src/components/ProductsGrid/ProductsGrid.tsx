import { Product } from "@/app/shared/types";

import { ProductCard } from "@/components/ProductCard";
import { LoadingSpinner } from "@/components/icons";

type ProductsGridProps = {
  products?: Product[];
  error?: string | null;
  onProductClick?: (product: Product) => void;
};

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  error,
  onProductClick,
}) => {
  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
      >
        <p className="font-medium">
          Unable to load products. Please try again later.
        </p>
        <p className="mt-2 text-sm" aria-label="Error details">
          {error}
        </p>
      </div>
    );
  }

  if (products === undefined) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading products"
        className="flex min-h-[200px] items-center justify-center"
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        role="region"
        aria-label="Empty product listing"
        className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-600 dark:border-gray-600 dark:text-gray-400"
      >
        <p>There are no products available at this moment.</p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Product listing"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product, index) => {
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.description}
            image={product.image}
            price={product.price}
            onClick={() => onProductClick?.(product)}
            priority={index < 6}
            product={product}
          />
        );
      })}
    </div>
  );
};
