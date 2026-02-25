"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";

import type { Product } from "@/app/shared/types";

import { addToCart } from "@/store";

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
  const dispatch = useDispatch();
  const truncatedDescription = truncateDescription(
    description,
    maxDescriptionLength,
  );
  const titleId = id
    ? `product-card-title-${id}`
    : `product-card-title-${title.replace(/\s+/g, "-")}`;
  const imageLoading = priority ? "eager" : "lazy";
  const fixedPrice = price.toFixed(2);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className="product-card flex flex-col justify-between rounded-sm border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
      data-testid="product-card"
      aria-labelledby={titleId}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={`View details for ${title}`}
        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:rounded-sm"
      >
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className="ml-auto mr-auto"
          loading={imageLoading}
        />
        <h2
          id={titleId}
          className="mt-2 font-medium text-neutral-900 dark:text-neutral-100"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {truncatedDescription}
        </p>
        <p className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          ${fixedPrice}
        </p>
      </div>
      {product && (
        <Button
          onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
          dataTestId={id ? `add-to-cart-${id}` : "add-to-cart-button"}
          ariaLabel="Add to cart"
          className="mt-4 w-full"
        >
          Add to cart
        </Button>
      )}
    </article>
  );
};
