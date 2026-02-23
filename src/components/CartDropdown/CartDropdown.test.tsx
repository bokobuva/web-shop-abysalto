import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import { cartReducer } from "@/store/cartSlice";

import { CartDropdown } from "./CartDropdown";

const createStore = (
  cartItems: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }[] = [],
) =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items: cartItems } },
  });

const renderWithRedux = (
  cartItems: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }[] = [],
) =>
  render(
    <Provider store={createStore(cartItems)}>
      <CartDropdown>
        <button type="button">Cart Trigger</button>
      </CartDropdown>
    </Provider>,
  );

describe("CartDropdown", () => {
  it("renders trigger", () => {
    renderWithRedux();
    expect(
      screen.getByRole("button", { name: /cart trigger/i }),
    ).toBeInTheDocument();
  });

  it("shows empty message when cart is empty and dropdown is open", () => {
    renderWithRedux();
    const trigger = screen.getByRole("button", { name: /cart trigger/i });
    fireEvent.mouseEnter(trigger.closest("div")!);
    expect(
      screen.getByText(
        /There are no items in the cart. Try adding your first product/,
      ),
    ).toBeInTheDocument();
  });

  it("shows cart items when cart has items and dropdown is open", () => {
    const items = [
      { productId: "1", quantity: 2, name: "Product A", price: 10, image: "" },
    ];
    renderWithRedux(items);
    const trigger = screen.getByRole("button", { name: /cart trigger/i });
    fireEvent.mouseEnter(trigger.closest("div")!);
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByTestId("cart-item-quantity-1")).toBeInTheDocument();
  });

  it("dispatches updateQuantity when quantity changes", () => {
    const store = createStore([
      { productId: "1", quantity: 2, name: "Product A", price: 10, image: "" },
    ]);
    render(
      <Provider store={store}>
        <CartDropdown>
          <button type="button">Cart Trigger</button>
        </CartDropdown>
      </Provider>,
    );
    fireEvent.mouseEnter(
      screen.getByRole("button", { name: /cart trigger/i }).closest("div")!,
    );
    const input = screen.getByTestId("cart-item-quantity-1");
    fireEvent.change(input, { target: { value: "5", valueAsNumber: 5 } });
    expect(store.getState().cart.items[0].quantity).toBe(5);
  });

  it("dispatches removeFromCart when item is deleted", async () => {
    const store = createStore([
      { productId: "1", quantity: 1, name: "Product A", price: 10, image: "" },
    ]);
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <CartDropdown>
          <button type="button">Cart Trigger</button>
        </CartDropdown>
      </Provider>,
    );
    fireEvent.mouseEnter(
      screen.getByRole("button", { name: /cart trigger/i }).closest("div")!,
    );
    await user.click(screen.getByTestId("cart-item-delete-1"));
    await user.click(screen.getByTestId("confirm-dialog-confirm"));
    expect(store.getState().cart.items).toHaveLength(0);
  });
});
