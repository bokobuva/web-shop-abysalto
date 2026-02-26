import searchReducer, {
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setSearchError,
} from "@/store/searchSlice";

const mockProducts = [
  {
    id: "1",
    name: "Test Product",
    price: 25,
    image: "",
    description: "",
    category: "beauty",
  },
];

describe("searchSlice", () => {
  const initialState = {
    searchQuery: "",
    searchResults: null,
    searchLoading: false,
    searchError: null,
  };

  it("has correct initial state", () => {
    expect(searchReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("setSearchQuery updates searchQuery", () => {
    const state = searchReducer(initialState, setSearchQuery("phone"));
    expect(state.searchQuery).toBe("phone");
  });

  it("setSearchResults sets results and clears loading/error", () => {
    const state = searchReducer(
      {
        ...initialState,
        searchLoading: true,
        searchError: "Previous error",
      },
      setSearchResults(mockProducts),
    );
    expect(state.searchResults).toEqual(mockProducts);
    expect(state.searchLoading).toBe(false);
    expect(state.searchError).toBeNull();
  });

  it("setSearchResults null clears search results", () => {
    const state = searchReducer(
      { ...initialState, searchResults: mockProducts },
      setSearchResults(null),
    );
    expect(state.searchResults).toBeNull();
  });

  it("setSearchLoading sets loading state", () => {
    const state = searchReducer(initialState, setSearchLoading(true));
    expect(state.searchLoading).toBe(true);
    expect(state.searchError).toBeNull();
  });

  it("setSearchError sets error and clears loading", () => {
    const state = searchReducer(
      { ...initialState, searchLoading: true },
      setSearchError("Network error"),
    );
    expect(state.searchError).toBe("Network error");
    expect(state.searchLoading).toBe(false);
  });
});
