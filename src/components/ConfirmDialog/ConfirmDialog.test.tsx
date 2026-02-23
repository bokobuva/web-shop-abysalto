import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders nothing when isOpen is false", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        message="Are you sure?"
      />,
    );
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("renders message and buttons when open", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        message="Are you sure?"
      />,
    );
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-dialog-confirm")).toHaveTextContent(
      "Delete",
    );
    expect(screen.getByTestId("confirm-dialog-cancel")).toHaveTextContent(
      "Cancel",
    );
  });

  it("calls onConfirm and onClose when Delete clicked", async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />,
    );
    await user.click(screen.getByTestId("confirm-dialog-confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel clicked", async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />,
    );
    await user.click(screen.getByTestId("confirm-dialog-cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("uses custom confirm and cancel labels", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        message="Confirm?"
        confirmLabel="Yes"
        cancelLabel="No"
      />,
    );
    expect(screen.getByTestId("confirm-dialog-confirm")).toHaveTextContent(
      "Yes",
    );
    expect(screen.getByTestId("confirm-dialog-cancel")).toHaveTextContent("No");
  });
});
