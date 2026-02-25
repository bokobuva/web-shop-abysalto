import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import type { SortOptionId } from "@/app/shared/types";
import paginationReducer from "@/store/paginationSlice";
import filtersReducer from "@/store/filtersSlice";
import sortReducer from "@/store/sortSlice";
import searchReducer from "@/store/searchSlice";

import { useResetPaginationOnFilterChange } from "../useResetPaginationOnFilterChange";

const createStore = () =>
  configureStore({
    reducer: {
      pagination: paginationReducer,
      filters: filtersReducer,
      sort: sortReducer,
      search: searchReducer,
    },
  });

describe("useResetPaginationOnFilterChange", () => {
  it("dispatches resetPagination on mount", () => {
    const store = createStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapperWithStore = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(
      () =>
        useResetPaginationOnFilterChange({
          categorySlug: "beauty",
          priceRangeId: null,
          searchQuery: "",
          sortOptionId: "default" as SortOptionId,
        }),
      { wrapper: wrapperWithStore },
    );

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "pagination/resetPagination",
    });
  });

  it("dispatches resetPagination when deps change", () => {
    const store = createStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapperWithStore = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const initialDeps = {
      categorySlug: null as string | null,
      priceRangeId: null as string | null,
      searchQuery: "",
      sortOptionId: "default" as SortOptionId,
    };

    const { rerender } = renderHook(
      (deps) => useResetPaginationOnFilterChange(deps),
      {
        initialProps: initialDeps,
        wrapper: wrapperWithStore,
      },
    );

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    dispatchSpy.mockClear();

    rerender({
      ...initialDeps,
      categorySlug: "beauty",
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "pagination/resetPagination",
    });
  });
});
