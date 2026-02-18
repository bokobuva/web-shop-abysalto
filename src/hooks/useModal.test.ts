import { act, renderHook } from "@testing-library/react";

import { useModal } from "./useModal";

describe("useModal", () => {
  it("returns isOpen false initially", () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  it("open sets isOpen to true", () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it("close sets isOpen to false", () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.open();
    });
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("toggle flips isOpen", () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
