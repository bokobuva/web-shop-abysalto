import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders children and calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} dataTestId="btn" ariaLabel="View details">
        Details
      </Button>,
    );
    const button = screen.getByRole("button", { name: /view details/i });
    expect(button).toHaveTextContent("Details");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <Button
        onClick={jest.fn()}
        dataTestId="btn"
        ariaLabel="View details"
        disabled
      >
        Details
      </Button>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
