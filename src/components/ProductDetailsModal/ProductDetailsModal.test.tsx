import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { Product } from "@/app/shared/types";

import { cartReducer } from "@/store/cartSlice";

import { ProductDetailsModal } from "./ProductDetailsModal";

const createStore = () =>
  configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items: [] } },
  });

const renderWithRedux = (props: {
  product: Product | null;
  onClose: () => void;
}) =>
  render(
    <Provider store={createStore()}>
      <ProductDetailsModal {...props} />
    </Provider>,
  );

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  price: 29.99,
  image: "https://example.com/image.jpg",
  description:
    "This is the full product description that should not be truncated when displayed in the modal.",
  category: "beauty",
};

describe("ProductDetailsModal", () => {
  it("returns null when product is null", () => {
    const { container } = renderWithRedux({
      product: null,
      onClose: jest.fn(),
    });
    expect(container.firstChild).toBeNull();
  });

  it("renders product image, name, full description, and price when product provided", () => {
    renderWithRedux({ product: mockProduct, onClose: jest.fn() });
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("loading", "eager");
    expect(
      screen.getByRole("heading", { name: "Test Product" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is the full product description that should not be truncated when displayed in the modal.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("displays full description without truncation", () => {
    const longDesc = "A".repeat(500);
    renderWithRedux({
      product: { ...mockProduct, description: longDesc },
      onClose: jest.fn(),
    });
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", () => {
    const onClose = jest.fn();
    renderWithRedux({ product: mockProduct, onClose });
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders AddToCartControls when product is provided", () => {
    renderWithRedux({ product: mockProduct, onClose: jest.fn() });
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });
});
