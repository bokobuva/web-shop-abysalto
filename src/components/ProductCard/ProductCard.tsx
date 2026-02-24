import Image from "next/image";

import type { Product } from "@/app/shared/types";

import { AddToCartControls } from "@/components/AddToCartControls";
import { Button } from "@/components/Button";

type ProductCardProps = {
  title: string;
  description: string;
  image: string;
  price: number;
  onClick: () => void;
  maxDescriptionLength?: number;
  id?: string;
  priority?: boolean;
  product?: Product;
};

const DEFAULT_MAX_DESCRIPTION_LENGTH = 100;

const truncateDescription = (
  description: string,
  maxLength: number,
): string => {
  if (description.length <= maxLength) return description;
  return `${description.slice(0, maxLength)}...`;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  image,
  price,
  onClick,
  maxDescriptionLength = DEFAULT_MAX_DESCRIPTION_LENGTH,
  id,
  priority = false,
  product,
}) => {
  const truncatedDescription = truncateDescription(
    description,
    maxDescriptionLength,
  );
  const titleId = id
    ? `product-card-title-${id}`
    : `product-card-title-${title.replace(/\s+/g, "-")}`;
  const imageLoading = priority ? "eager" : "lazy";
  const fixedPrice = price.toFixed(2);
  const detailsButtonTestId = id
    ? `product-card-details-${id}`
    : "product-card-details-button";

  return (
    <article
      className="product-card rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900 flex flex-col justify-between"
      data-testid="product-card"
      aria-labelledby={titleId}
    >
      <Image
        src={image}
        alt={title}
        width={200}
        height={200}
        className="ml-auto mr-auto"
        loading={imageLoading}
      />
      <h2 id={titleId} className="mt-2 font-semibold">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {truncatedDescription}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${fixedPrice}
        </p>
        <div className="flex items-center gap-2 justify-between w-full">
          <Button
            onClick={onClick}
            dataTestId={detailsButtonTestId}
            ariaLabel={`View details for ${title}`}
          >
            Details
          </Button>
          {product && <AddToCartControls product={product} />}
        </div>
      </div>
    </article>
  );
};
