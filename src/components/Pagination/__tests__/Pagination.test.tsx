import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "../Pagination";

describe("Pagination", () => {
  it("renders navigation with Previous, Page info, and Next", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />,
    );
    expect(
      screen.getByRole("navigation", { name: /pagination/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to previous page/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to next page/i }),
    ).toBeInTheDocument();
  });

  it("disables Previous on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
    );
    expect(screen.getByTestId("pagination-prev")).toBeDisabled();
    expect(screen.getByTestId("pagination-next")).not.toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(
      <Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />,
    );
    expect(screen.getByTestId("pagination-prev")).not.toBeDisabled();
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
  });

  it("calls onPageChange with previous page when Previous clicked", async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with next page when Next clicked", async () => {
    const onPageChange = jest.fn();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
