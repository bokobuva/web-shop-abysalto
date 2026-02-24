import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { CartItem as CartItemType } from "@/app/shared/types";

import { CartItem } from "../CartItem";

const mockItem: CartItemType = {
  productId: "1",
  quantity: 2,
  name: "Test Product",
  price: 19.99,
  image: "https://example.com/image.jpg",
};

describe("CartItem", () => {
  it("renders item name, price, and quantity", () => {
    render(
      <CartItem
        item={mockItem}
        onQuantityChange={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(/\$39\.98/)).toBeInTheDocument();
  });

  it("calls onQuantityChange when quantity input changes", () => {
    const onQuantityChange = jest.fn();
    render(
      <CartItem
        item={mockItem}
        onQuantityChange={onQuantityChange}
        onDelete={jest.fn()}
      />,
    );
    const input = screen.getByTestId("cart-item-quantity-1");
    fireEvent.change(input, { target: { value: "5", valueAsNumber: 5 } });
    expect(onQuantityChange).toHaveBeenCalledWith("1", 5);
  });

  it("opens confirm dialog when delete button clicked", async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onQuantityChange={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    await user.click(screen.getByTestId("cart-item-delete-1"));
    expect(
      screen.getByText(/Are you sure you want to remove this item/),
    ).toBeInTheDocument();
  });

  it("calls onDelete when Delete confirmed in dialog", async () => {
    const onDelete = jest.fn();
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onQuantityChange={jest.fn()}
        onDelete={onDelete}
      />,
    );
    await user.click(screen.getByTestId("cart-item-delete-1"));
    await user.click(screen.getByTestId("confirm-dialog-confirm"));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("closes dialog when Cancel clicked", async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onQuantityChange={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    await user.click(screen.getByTestId("cart-item-delete-1"));
    expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
    await user.click(screen.getByTestId("confirm-dialog-cancel"));
    expect(screen.queryByText(/Are you sure/)).not.toBeInTheDocument();
  });
});
