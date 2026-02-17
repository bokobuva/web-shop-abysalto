import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Card } from "./Card";

describe("Card", () => {
  const defaultProps = {
    title: "Test Product",
    description: "Short description",
    image: "https://example.com/image.jpg",
    onClick: jest.fn(),
  };

  it("renders title and description", () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Short description")).toBeInTheDocument();
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

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<Card {...defaultProps} onClick={onClick} />);
    await userEvent.click(
      screen.getByRole("button", { name: /view details for test product/i }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick on Enter key", async () => {
    const onClick = jest.fn();
    render(<Card {...defaultProps} onClick={onClick} />);
    const card = screen.getByRole("button", {
      name: /view details for test product/i,
    });
    card.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
