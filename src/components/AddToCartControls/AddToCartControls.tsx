"use client";

import { useCallback, useId, useState } from "react";
import { useDispatch } from "react-redux";

import type { Product } from "@/app/shared/types";

import { addToCart } from "@/store";

import { Button } from "@/components/Button";

type AddToCartControlsProps = {
  product: Product;
  onAddToCart?: () => void;
};

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999; // TODO: Discuss business logic with PO for max quantity and implement safe max limit

export const AddToCartControls: React.FC<AddToCartControlsProps> = ({
  product,
  onAddToCart,
}) => {
  const { id } = product;
  const dispatch = useDispatch();
  const quantityInputId = useId();
  const [quantity, setQuantity] = useState(MIN_QUANTITY);

  const handleAddToCart = useCallback(() => {
    const qty = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, quantity));
    setQuantity(MIN_QUANTITY);
    dispatch(addToCart({ product, quantity: qty }));
    onAddToCart?.();
  }, [dispatch, product, quantity, onAddToCart]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    if (!Number.isNaN(value)) {
      setQuantity(Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, value)));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        id={quantityInputId}
        name={`quantity-${id}`}
        type="number"
        min={MIN_QUANTITY}
        max={MAX_QUANTITY}
        value={quantity}
        onChange={handleQuantityChange}
        aria-label="Quantity"
        data-testid="add-to-cart-quantity"
        className="w-16 rounded-sm border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
      />
      <Button
        onClick={handleAddToCart}
        dataTestId="add-to-cart-button"
        ariaLabel="Add to cart"
      >
        Add to cart
      </Button>
    </div>
  );
};
