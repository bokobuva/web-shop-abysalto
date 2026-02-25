import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { getStoredCart, setStoredCart } from "@/lib/cart/cartStorage";
import productsReducer from "@/store/productsSlice";
import categoriesReducer from "@/store/categoriesSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";
import paginationReducer from "@/store/paginationSlice";
import { authReducer } from "@/store/authSlice";
import { cartReducer } from "@/store/cartSlice";

import { useCartPersistence } from "../useCartPersistence";

jest.mock("@/lib/cart/cartStorage");

const mockGetStoredCart = getStoredCart as jest.MockedFunction<
  typeof getStoredCart
>;
const mockSetStoredCart = setStoredCart as jest.MockedFunction<
  typeof setStoredCart
>;

const createStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
      pagination: paginationReducer,
      auth: authReducer,
      cart: cartReducer,
    },
  });

describe("useCartPersistence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches setCart on mount when localStorage has items", () => {
    const storedItems = [
      {
        productId: "1",
        quantity: 2,
        name: "Product A",
        price: 25,
        image: "",
      },
    ];
    mockGetStoredCart.mockReturnValue(storedItems);

    const store = createStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapperWithStore = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useCartPersistence(store), {
      wrapper: wrapperWithStore,
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "cart/setCart",
        payload: storedItems,
      }),
    );
  });

  it("does not dispatch when localStorage is empty", () => {
    mockGetStoredCart.mockReturnValue([]);

    const store = createStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapperWithStore = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useCartPersistence(store), {
      wrapper: wrapperWithStore,
    });

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("subscribes to store and persists cart on change", () => {
    mockGetStoredCart.mockReturnValue([]);

    const store = createStore();

    const wrapperWithStore = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useCartPersistence(store), {
      wrapper: wrapperWithStore,
    });

    const newItems = [
      {
        productId: "2",
        quantity: 1,
        name: "Product B",
        price: 50,
        image: "",
      },
    ];

    act(() => {
      store.dispatch({
        type: "cart/setCart",
        payload: newItems,
      });
    });

    expect(mockSetStoredCart).toHaveBeenCalledWith(newItems);
  });
});
