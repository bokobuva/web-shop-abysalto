"use client";

import Image from "next/image";
import { useState } from "react";

import type { CartItem as CartItemType } from "@/app/shared/types";

import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TrashIcon } from "@/components/icons";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

const REMOVE_CONFIRM_MESSAGE =
  "Are you sure you want to remove this item? Note that all quantities will be removed from the cart.";

type CartItemProps = {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onDelete: (productId: string) => void;
};

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onDelete,
}) => {
  const { productId, name, quantity, price, image } = item;
  const [showConfirm, setShowConfirm] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    if (!Number.isNaN(value)) {
      const qty = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, value));
      onQuantityChange(productId, qty);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(productId);
    setShowConfirm(false);
  };

  const fixedItemPrice = price.toFixed(2);
  const fixedItemTotalPrice = (price * quantity).toFixed(2);

  return (
    <>
      <article
        className="flex gap-3 border-b border-neutral-200 px-3 py-3 last:border-b-0 dark:border-neutral-700"
        data-testid={`cart-item-${productId}`}
      >
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-700">
          {image ? (
            <Image
              src={image}
              alt={`${name} image`}
              width={70}
              height={70}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-400 dark:bg-neutral-600"
              aria-hidden
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {name}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            ${fixedItemPrice} × {quantity} = ${fixedItemTotalPrice}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 w-full justify-end">
            <input
              id={`cart-item-quantity-${productId}`}
              name={`cart-quantity-${productId}`}
              type="number"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={handleQuantityChange}
              aria-label={`Quantity for ${name}`}
              data-testid={`cart-item-quantity-${productId}`}
              className="h-full w-14 rounded-sm border border-neutral-300 px-1.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
            <Button
              onClick={() => setShowConfirm(true)}
              dataTestId={`cart-item-delete-${productId}`}
              ariaLabel={`Remove ${name} from cart`}
            >
              <TrashIcon size={18} />
            </Button>
          </div>
        </div>
      </article>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        message={REMOVE_CONFIRM_MESSAGE}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};
