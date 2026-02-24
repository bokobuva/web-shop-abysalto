import { act, fireEvent, render, screen } from "@testing-library/react";

import { Dropdown } from "../Dropdown";

describe("Dropdown", () => {
  it("renders trigger", () => {
    render(
      <Dropdown trigger={<button type="button">Open</button>}>
        <p>Dropdown content</p>
      </Dropdown>,
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("does not show content initially", () => {
    render(
      <Dropdown trigger={<button type="button">Open</button>}>
        <p>Dropdown content</p>
      </Dropdown>,
    );
    expect(screen.queryByText("Dropdown content")).not.toBeInTheDocument();
  });

  it("shows content on mouse enter", () => {
    const { container } = render(
      <Dropdown trigger={<button type="button">Open</button>}>
        <p>Dropdown content</p>
      </Dropdown>,
    );
    const wrapper = container.querySelector(".relative.inline-block");
    expect(wrapper).toBeTruthy();
    fireEvent.mouseEnter(wrapper!);
    expect(screen.getByText("Dropdown content")).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const { container } = render(
      <Dropdown trigger={<button type="button">Open</button>}>
        <p>Dropdown content</p>
      </Dropdown>,
    );
    const wrapper = container.querySelector(".relative.inline-block");
    fireEvent.mouseEnter(wrapper!);
    expect(screen.getByText("Dropdown content")).toBeInTheDocument();
    fireEvent.keyDown(wrapper!, { key: "Escape" });
    expect(screen.queryByText("Dropdown content")).not.toBeInTheDocument();
  });

  it("closes when focus moves outside the dropdown", () => {
    render(
      <>
        <Dropdown trigger={<button type="button">Open</button>}>
          <p>Dropdown content</p>
        </Dropdown>
        <button type="button">Outside</button>
      </>,
    );
    fireEvent.mouseEnter(document.querySelector(".relative.inline-block")!);
    expect(screen.getByText("Dropdown content")).toBeInTheDocument();
    const outsideButton = screen.getByRole("button", { name: "Outside" });
    act(() => {
      outsideButton.focus();
      outsideButton.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });
    expect(screen.queryByText("Dropdown content")).not.toBeInTheDocument();
  });

  it("applies aria-label to trigger when provided", () => {
    render(
      <Dropdown trigger={<span>Cart</span>} ariaLabel="Shopping cart">
        <p>Content</p>
      </Dropdown>,
    );
    const trigger = screen.getByLabelText("Shopping cart");
    expect(trigger).toBeInTheDocument();
  });
});
