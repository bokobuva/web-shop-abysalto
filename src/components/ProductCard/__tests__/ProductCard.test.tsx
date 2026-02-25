import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import { ProductCard } from "@/components/ProductCard";
import { cartReducer } from "@/store/cartSlice";

import type { Product } from "@/app/shared/types";

const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: { cart: { items: [] } },
});

const renderWithProvider = (ui: React.ReactElement) =>
  render(<Provider store={store}>{ui}</Provider>);

describe("ProductCard", () => {
  const defaultProps = {
    title: "Test Product",
    description: "Short description",
    image: "https://example.com/image.jpg",
    price: 9.99,
    onClick: jest.fn(),
  };

  it("renders title, description, and price", () => {
    renderWithProvider(<ProductCard {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("truncates description to 100 characters by default", () => {
    const longDescription = "a".repeat(150);
    renderWithProvider(
      <ProductCard {...defaultProps} description={longDescription} />,
    );
    expect(screen.getByText(`${"a".repeat(100)}...`)).toBeInTheDocument();
  });

  it("does not truncate description under 100 characters", () => {
    const shortDesc = "Short";
    renderWithProvider(
      <ProductCard {...defaultProps} description={shortDesc} />,
    );
    expect(screen.getByText("Short")).toBeInTheDocument();
  });

  it("uses custom maxDescriptionLength when provided", () => {
    const desc = "a".repeat(80);
    renderWithProvider(
      <ProductCard
        {...defaultProps}
        description={desc}
        maxDescriptionLength={50}
      />,
    );
    expect(screen.getByText(`${"a".repeat(50)}...`)).toBeInTheDocument();
  });

  it("renders clickable card content with accessibility attributes", () => {
    renderWithProvider(<ProductCard {...defaultProps} />);
    const clickableRegion = screen.getByRole("button", {
      name: /view details for test product/i,
    });
    expect(clickableRegion).toHaveAttribute(
      "aria-label",
      "View details for Test Product",
    );
  });

  it("calls onClick when card content is clicked", async () => {
    const onClick = jest.fn();
    renderWithProvider(<ProductCard {...defaultProps} onClick={onClick} />);
    await userEvent.click(
      screen.getByRole("button", { name: /view details for test product/i }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets loading eager when priority is true", () => {
    renderWithProvider(<ProductCard {...defaultProps} priority />);
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("sets loading lazy when priority is false or omitted", () => {
    renderWithProvider(<ProductCard {...defaultProps} />);
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("calls onClick when Enter is pressed on card content", async () => {
    const onClick = jest.fn();
    renderWithProvider(<ProductCard {...defaultProps} onClick={onClick} />);
    const clickableRegion = screen.getByRole("button", {
      name: /view details for test product/i,
    });
    clickableRegion.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders Add to cart button when product is provided", () => {
    const product: Product = {
      id: "1",
      name: "Test Product",
      price: 9.99,
      image: "https://example.com/image.jpg",
      description: "Short description",
      category: "beauty",
    };
    renderWithProvider(<ProductCard {...defaultProps} product={product} />);
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("does not call onClick when Add to cart button is clicked", async () => {
    const onClick = jest.fn();
    const product: Product = {
      id: "1",
      name: "Test Product",
      price: 9.99,
      image: "https://example.com/image.jpg",
      description: "Short description",
      category: "beauty",
    };
    renderWithProvider(
      <ProductCard {...defaultProps} onClick={onClick} product={product} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
