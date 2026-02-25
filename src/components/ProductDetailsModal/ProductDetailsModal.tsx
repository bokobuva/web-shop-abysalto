import Image from "next/image";

import type { Product } from "@/app/shared/types";

import { AddToCartControls } from "@/components/AddToCartControls";
import { Modal } from "@/components/Modal";

type ProductDetailsModalProps = {
  product: Product | null;
  onClose: () => void;
};

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const { id, name, description, image, price } = product;
  const titleId = `product-details-title-${id}`;
  const fixedPrice = price.toFixed(2);
  const descId = `product-details-desc-${id}`;

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      ariaLabelledBy={titleId}
      ariaDescribedBy={descId}
    >
      <Image
        src={image}
        alt={name}
        width={400}
        height={400}
        className="mb-4 w-full rounded-sm object-cover"
        loading="eager"
      />
      <h2
        id={titleId}
        className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100"
      >
        {name}
      </h2>
      <p id={descId} className="mb-4 text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
      <div className="flex flex-wrap items-center gap-4 justify-between w-full">
        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          ${fixedPrice}
        </p>
        <AddToCartControls product={product} onAddToCart={onClose} />
      </div>
    </Modal>
  );
};
