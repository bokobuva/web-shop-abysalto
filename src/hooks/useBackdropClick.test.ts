import { renderHook } from "@testing-library/react";

import { useBackdropClick } from "./useBackdropClick";

describe("useBackdropClick", () => {
  it("returns a function", () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useBackdropClick(onClose));
    expect(typeof result.current).toBe("function");
  });

  it("calls onClose when target equals currentTarget", () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useBackdropClick(onClose));
    const handler = result.current;

    const target = document.createElement("div");
    handler({
      target,
      currentTarget: target,
    } as React.MouseEvent<HTMLDivElement>);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when target differs from currentTarget", () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useBackdropClick(onClose));
    const handler = result.current;

    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);

    handler({
      target: child,
      currentTarget: parent,
    } as React.MouseEvent<HTMLDivElement>);

    expect(onClose).not.toHaveBeenCalled();
  });
});
