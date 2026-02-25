import { renderHook } from "@testing-library/react";

import type { Product } from "@/app/shared/types";

import { useCloseProductModalWhenNotFound } from "../useCloseProductModalWhenNotFound";

const mockProduct: Product = {
  id: "1",
  name: "Product A",
  price: 25,
  image: "",
  description: "",
  category: "beauty",
};

describe("useCloseProductModalWhenNotFound", () => {
  it("calls closeProduct when selectedProductId exists but product is missing and not loading", () => {
    const closeProduct = jest.fn();

    renderHook(() =>
      useCloseProductModalWhenNotFound("1", null, false, closeProduct),
    );

    expect(closeProduct).toHaveBeenCalledTimes(1);
  });

  it("does not call closeProduct when selectedProductId is null", () => {
    const closeProduct = jest.fn();

    renderHook(() =>
      useCloseProductModalWhenNotFound(null, null, false, closeProduct),
    );

    expect(closeProduct).not.toHaveBeenCalled();
  });

  it("does not call closeProduct when product exists", () => {
    const closeProduct = jest.fn();

    renderHook(() =>
      useCloseProductModalWhenNotFound("1", mockProduct, false, closeProduct),
    );

    expect(closeProduct).not.toHaveBeenCalled();
  });

  it("does not call closeProduct when still loading", () => {
    const closeProduct = jest.fn();

    renderHook(() =>
      useCloseProductModalWhenNotFound("1", null, true, closeProduct),
    );

    expect(closeProduct).not.toHaveBeenCalled();
  });
});
