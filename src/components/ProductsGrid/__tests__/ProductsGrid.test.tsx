import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { Product } from "@/app/shared/types";

import { ProductsGrid } from "@/components/ProductsGrid";
import { cartReducer } from "@/store/cartSlice";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  price: 9.99,
  image: "https://example.com/image.jpg",
  description: "Test description",
  category: "beauty",
};

describe("ProductsGrid", () => {
  it("shows loader when products is undefined", () => {
    render(<ProductsGrid />);
    expect(
      screen.getByRole("status", { name: /loading products/i }),
    ).toBeInTheDocument();
  });

  it("shows error message when error is provided", () => {
    render(<ProductsGrid error="Network error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/unable to load products/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/error details/i)).toHaveTextContent(
      "Network error",
    );
  });

  it("shows error over products when both are provided", () => {
    render(<ProductsGrid products={[mockProduct]} error="API error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
  });

  it("shows empty message when products is empty array", () => {
    render(<ProductsGrid products={[]} />);
    expect(
      screen.getByRole("region", { name: /empty product listing/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no products available/i)).toBeInTheDocument();
  });

  it("renders products when products array has items", () => {
    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: { cart: { items: [] } },
    });
    render(
      <Provider store={store}>
        <ProductsGrid products={[mockProduct]} />
      </Provider>,
    );
    expect(
      screen.getByRole("region", { name: /product listing/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });
});
