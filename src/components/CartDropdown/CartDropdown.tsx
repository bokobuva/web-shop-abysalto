"use client";

import { useDispatch, useSelector } from "react-redux";

import { selectCartItems, selectCartTotalCount } from "@/store/selectors";
import { removeFromCart, updateQuantity } from "@/store";

import { CartItem } from "@/components/CartItem";
import { Dropdown } from "@/components/Dropdown";

const EMPTY_MESSAGE =
  "There are no items in the cart. Try adding your first product.";

type CartDropdownProps = {
  children: React.ReactNode;
};

export const CartDropdown: React.FC<CartDropdownProps> = ({ children }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const cartTotalCount = useSelector(selectCartTotalCount);

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleDelete = (productId: string) => {
    dispatch(removeFromCart({ productId }));
  };

  const cartAriaLabel = `Cart with ${cartTotalCount} items`;

  const content =
    items.length === 0 ? (
      <p className="px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {EMPTY_MESSAGE}
      </p>
    ) : (
      <div className="flex flex-col">
        {items.map((item) => {
          return (
            <CartItem
              key={item.productId}
              item={item}
              onQuantityChange={handleQuantityChange}
              onDelete={handleDelete}
            />
          );
        })}
      </div>
    );

  return (
    <Dropdown trigger={children} ariaLabel={cartAriaLabel}>
      {content}
    </Dropdown>
  );
};
