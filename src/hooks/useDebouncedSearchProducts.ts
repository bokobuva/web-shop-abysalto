"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSearchProducts } from "@/app/services/products";

import {
  setSearchError,
  setSearchLoading,
  setSearchResults,
} from "@/store/searchSlice";
import { selectSearchQuery } from "@/store/selectors";

const DEBOUNCE_MS = 250;

export function useDebouncedSearchProducts() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const trimmed = searchQuery.trim();

    const timeoutId = setTimeout(() => {
      if (trimmed === "") {
        dispatch(setSearchResults(null));
        dispatch(setSearchError(null));
        return;
      }

      dispatch(setSearchLoading(true));

      fetchSearchProducts(trimmed)
        .then((products) => {
          if (cancelledRef.current) return;
          dispatch(setSearchResults(products));
        })
        .catch((err) => {
          if (cancelledRef.current) return;
          dispatch(setSearchResults([]));
          dispatch(
            setSearchError(
              err instanceof Error ? err.message : "Failed to search products",
            ),
          );
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelledRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, dispatch]);
}
