import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import { ProductCard } from "@/components/ProductCard";
import { cartReducer } from "@/store/cartSlice";

import type { Product } from "@/app/shared/types";

describe("ProductCard", () => {
  const defaultProps = {
    title: "Test Product",
    description: "Short description",
    image: "https://example.com/image.jpg",
    price: 9.99,
    onClick: jest.fn(),
  };

  it("renders title, description, and price", () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("truncates description to 100 characters by default", () => {
    const longDescription = "a".repeat(150);
    render(<ProductCard {...defaultProps} description={longDescription} />);
    expect(screen.getByText(`${"a".repeat(100)}...`)).toBeInTheDocument();
  });

  it("does not truncate description under 100 characters", () => {
    const shortDesc = "Short";
    render(<ProductCard {...defaultProps} description={shortDesc} />);
    expect(screen.getByText("Short")).toBeInTheDocument();
  });

  it("uses custom maxDescriptionLength when provided", () => {
    const desc = "a".repeat(80);
    render(
      <ProductCard
        {...defaultProps}
        description={desc}
        maxDescriptionLength={50}
      />,
    );
    expect(screen.getByText(`${"a".repeat(50)}...`)).toBeInTheDocument();
  });

  it("renders Details button with accessibility attributes", () => {
    render(<ProductCard {...defaultProps} />);
    const detailsButton = screen.getByRole("button", {
      name: /view details for test product/i,
    });
    expect(detailsButton).toHaveAttribute(
      "data-testid",
      "product-card-details-button",
    );
    expect(detailsButton).toHaveAttribute(
      "aria-label",
      "View details for Test Product",
    );
    expect(detailsButton).toHaveTextContent("Details");
  });

  it("calls onClick when Details button is clicked", async () => {
    const onClick = jest.fn();
    render(<ProductCard {...defaultProps} onClick={onClick} />);
    await userEvent.click(
      screen.getByRole("button", { name: /view details for test product/i }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets loading eager when priority is true", () => {
    render(<ProductCard {...defaultProps} priority />);
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("sets loading lazy when priority is false or omitted", () => {
    render(<ProductCard {...defaultProps} />);
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("calls onClick when Enter is pressed on Details button", async () => {
    const onClick = jest.fn();
    render(<ProductCard {...defaultProps} onClick={onClick} />);
    const detailsButton = screen.getByRole("button", {
      name: /view details for test product/i,
    });
    detailsButton.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders AddToCartControls when product is provided", () => {
    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: { cart: { items: [] } },
    });
    const product: Product = {
      id: "1",
      name: "Test Product",
      price: 9.99,
      image: "https://example.com/image.jpg",
      description: "Short description",
      category: "beauty",
    };
    render(
      <Provider store={store}>
        <ProductCard {...defaultProps} product={product} />
      </Provider>,
    );
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });
});
