import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { Product } from "@/app/shared/types";

import { cartReducer } from "@/store/cartSlice";

import { AddToCartControls } from "../AddToCartControls";

const mockProduct: Product = {
  id: "42",
  name: "Test Product",
  price: 29.99,
  image: "",
  description: "",
  category: "beauty",
};

const createStore = () =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items: [] } },
  });

const renderWithRedux = (props: {
  product: Product;
  onAddToCart?: () => void;
}) => {
  const store = createStore();
  return {
    ...render(
      <Provider store={store}>
        <AddToCartControls {...props} />
      </Provider>,
    ),
    store,
  };
};

describe("AddToCartControls", () => {
  it("renders quantity input and Add to cart button", () => {
    renderWithRedux({ product: mockProduct });
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it("dispatches addToCart when button clicked", async () => {
    const { store } = renderWithRedux({ product: mockProduct });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0]).toEqual({
      productId: "42",
      quantity: 1,
      name: "Test Product",
      price: 29.99,
      image: "",
    });
  });

  it("adds with custom quantity", async () => {
    const { store } = renderWithRedux({ product: mockProduct });
    const user = userEvent.setup();

    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, {
      target: { value: "5", valueAsNumber: 5 },
    });
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(store.getState().cart.items[0].quantity).toBe(5);
  });

  it("calls onAddToCart when provided", async () => {
    const onAddToCart = jest.fn();
    const user = userEvent.setup();
    renderWithRedux({ product: mockProduct, onAddToCart });

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalled();
  });
});
