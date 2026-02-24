import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import { useProductModal } from "../useProductModal";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
}));

const mockProducts = [
  {
    id: "1",
    name: "Product A",
    price: 25,
    image: "",
    description: "Full description",
    category: "beauty",
  },
];

const createStore = () =>
  configureStore({
    reducer: {
      products: (
        state = { items: mockProducts, isLoading: false, error: null },
      ) => state,
      categories: (state = { items: [], isLoading: false, error: null }) =>
        state,
      filters: (state = { categorySlug: null, priceRangeId: null }) => state,
      sort: (state = { sortOptionId: "default" }) => state,
      search: (state = { searchQuery: "" }) => state,
      pagination: (state = { currentPage: 1, pageSize: 20 }) => state,
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createStore()}>{children}</Provider>
);

describe("useProductModal", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it("returns selectedProductId null and product null when no query param", () => {
    const { result } = renderHook(() => useProductModal(), { wrapper });
    expect(result.current.selectedProductId).toBeNull();
    expect(result.current.product).toBeNull();
  });

  it("returns product when searchParams has product id", () => {
    mockSearchParams.set("product", "1");
    const { result } = renderHook(() => useProductModal(), { wrapper });
    expect(result.current.selectedProductId).toBe("1");
    expect(result.current.product).toEqual(mockProducts[0]);
  });

  it("openProduct calls router.replace with product param", () => {
    const { result } = renderHook(() => useProductModal(), { wrapper });
    act(() => {
      result.current.openProduct("1");
    });
    expect(mockReplace).toHaveBeenCalledWith("/?product=1");
  });

  it("closeProduct calls router.replace without product param", () => {
    mockSearchParams.set("product", "1");
    const { result } = renderHook(() => useProductModal(), { wrapper });
    act(() => {
      result.current.closeProduct();
    });
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
