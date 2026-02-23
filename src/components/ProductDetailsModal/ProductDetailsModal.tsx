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

  const titleId = `product-details-title-${product.id}`;
  const descId = `product-details-desc-${product.id}`;

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      ariaLabelledBy={titleId}
      ariaDescribedBy={descId}
    >
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={400}
        className="mb-4 w-full rounded-lg object-cover"
        loading="eager"
      />
      <h2 id={titleId} className="mb-2 text-xl font-semibold text-white">
        {product.name}
      </h2>
      <p id={descId} className="mb-4 text-gray-600 dark:text-gray-400">
        {product.description}
      </p>
      <div className="flex flex-wrap items-center gap-4 justify-between w-full">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${product.price.toFixed(2)}
        </p>
        <AddToCartControls product={product} onAddToCart={onClose} />
      </div>
    </Modal>
  );
};
