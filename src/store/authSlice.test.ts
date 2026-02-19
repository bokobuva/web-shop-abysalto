import { authReducer } from "@/store/authSlice";
import {
  setUser,
  setAuthLoading,
  setAuthError,
  setAuthInitialized,
} from "@/store/authSlice";

const mockUser = {
  id: 1,
  username: "emilys",
  email: "emily@example.com",
  firstName: "Emily",
  lastName: "Johnson",
};

describe("authSlice", () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isInitialized: false,
  };

  it("has correct initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("setUser sets user and clears error when user is non-null", () => {
    const state = authReducer(
      { ...initialState, error: "Previous error" },
      setUser(mockUser),
    );
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  it("setUser preserves error when clearing user", () => {
    const state = authReducer(
      { ...initialState, user: mockUser, error: "Login failed" },
      setUser(null),
    );
    expect(state.user).toBeNull();
    expect(state.error).toBe("Login failed");
  });

  it("setUser with null clears user", () => {
    const state = authReducer(
      { ...initialState, user: mockUser },
      setUser(null),
    );
    expect(state.user).toBeNull();
  });

  it("setAuthLoading updates loading state", () => {
    expect(authReducer(initialState, setAuthLoading(true)).isLoading).toBe(
      true,
    );
    expect(
      authReducer({ ...initialState, isLoading: true }, setAuthLoading(false))
        .isLoading,
    ).toBe(false);
  });

  it("setAuthError updates error state", () => {
    const state = authReducer(
      initialState,
      setAuthError("Invalid credentials"),
    );
    expect(state.error).toBe("Invalid credentials");
  });

  it("setAuthError with null clears error", () => {
    const state = authReducer(
      { ...initialState, error: "Error" },
      setAuthError(null),
    );
    expect(state.error).toBeNull();
  });

  it("setAuthInitialized updates initialized state", () => {
    const state = authReducer(initialState, setAuthInitialized(true));
    expect(state.isInitialized).toBe(true);
  });
});
