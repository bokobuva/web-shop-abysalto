import { act, renderHook } from "@testing-library/react";
import { useRef, useState } from "react";

import { useFocusOutside } from "../useFocusOutside";

function createContainerWithChild() {
  const container = document.createElement("div");
  const child = document.createElement("button");
  child.textContent = "Inside";
  container.appendChild(child);
  document.body.appendChild(container);
  return { container, child };
}

describe("useFocusOutside", () => {
  it("calls onClose when focus moves outside the container", () => {
    const onClose = jest.fn();
    const { container, child } = createContainerWithChild();
    const containerRef = { current: container };

    renderHook(() => useFocusOutside(containerRef, true, onClose));

    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.appendChild(outside);

    act(() => {
      const focusInEvent = new FocusEvent("focusin", { bubbles: true });
      Object.defineProperty(focusInEvent, "target", {
        value: outside,
        writable: false,
      });
      document.dispatchEvent(focusInEvent);
    });

    expect(onClose).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it("does not call onClose when focus stays inside the container", () => {
    const onClose = jest.fn();
    const { container, child } = createContainerWithChild();
    const containerRef = { current: container };

    renderHook(() => useFocusOutside(containerRef, true, onClose));

    act(() => {
      const focusInEvent = new FocusEvent("focusin", { bubbles: true });
      Object.defineProperty(focusInEvent, "target", {
        value: child,
        writable: false,
      });
      document.dispatchEvent(focusInEvent);
    });

    expect(onClose).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("does not attach listener when isActive is false", () => {
    const onClose = jest.fn();
    const { container } = createContainerWithChild();
    const containerRef = { current: container };

    renderHook(() => useFocusOutside(containerRef, false, onClose));

    const outside = document.createElement("button");
    document.body.appendChild(outside);

    act(() => {
      const focusInEvent = new FocusEvent("focusin", {
        bubbles: true,
        target: outside,
      });
      document.dispatchEvent(focusInEvent);
    });

    expect(onClose).not.toHaveBeenCalled();

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });
});
