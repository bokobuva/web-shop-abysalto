import { fireEvent, render, screen } from "@testing-library/react";

import type { Product } from "@/app/shared/types";

import { ProductDetailsModal } from "./ProductDetailsModal";

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
    const { container } = render(
      <ProductDetailsModal product={null} onClose={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders product image, name, full description, and price when product provided", () => {
    render(<ProductDetailsModal product={mockProduct} onClose={jest.fn()} />);
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
    render(
      <ProductDetailsModal
        product={{ ...mockProduct, description: longDesc }}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", () => {
    const onClose = jest.fn();
    render(<ProductDetailsModal product={mockProduct} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
