import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Card } from "@/components/Card";

describe("Card", () => {
  const defaultProps = {
    title: "Test Product",
    description: "Short description",
    image: "https://example.com/image.jpg",
    price: 9.99,
    onClick: jest.fn(),
  };

  it("renders title, description, and price", () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("truncates description to 100 characters by default", () => {
    const longDescription = "a".repeat(150);
    render(<Card {...defaultProps} description={longDescription} />);
    expect(screen.getByText(`${"a".repeat(100)}...`)).toBeInTheDocument();
  });

  it("does not truncate description under 100 characters", () => {
    const shortDesc = "Short";
    render(<Card {...defaultProps} description={shortDesc} />);
    expect(screen.getByText("Short")).toBeInTheDocument();
  });

  it("uses custom maxDescriptionLength when provided", () => {
    const desc = "a".repeat(80);
    render(
      <Card {...defaultProps} description={desc} maxDescriptionLength={50} />,
    );
    expect(screen.getByText(`${"a".repeat(50)}...`)).toBeInTheDocument();
  });

  it("renders Details button with accessibility attributes", () => {
    render(<Card {...defaultProps} />);
    const detailsButton = screen.getByRole("button", {
      name: /view details for test product/i,
    });
    expect(detailsButton).toHaveAttribute("data-testid", "card-details-button");
    expect(detailsButton).toHaveAttribute(
      "aria-label",
      "View details for Test Product",
    );
    expect(detailsButton).toHaveTextContent("Details");
  });

  it("calls onClick when Details button is clicked", async () => {
    const onClick = jest.fn();
    render(<Card {...defaultProps} onClick={onClick} />);
    await userEvent.click(
      screen.getByRole("button", { name: /view details for test product/i }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets loading eager when priority is true", () => {
    render(<Card {...defaultProps} priority />);
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("sets loading lazy when priority is false or omitted", () => {
    render(<Card {...defaultProps} />);
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("calls onClick when Enter is pressed on Details button", async () => {
    const onClick = jest.fn();
    render(<Card {...defaultProps} onClick={onClick} />);
    const detailsButton = screen.getByRole("button", {
      name: /view details for test product/i,
    });
    detailsButton.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
