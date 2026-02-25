import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

import * as authApi from "@/app/services/auth";
import { getTokens } from "@/lib/auth/tokenStorage";

import { authReducer } from "@/store/authSlice";

import { LoginForm } from "../LoginForm";

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockGetTokens = getTokens as jest.MockedFunction<typeof getTokens>;

let useRealAuth = false;
jest.mock("@/hooks/useAuth", () => {
  const actual =
    jest.requireActual<typeof import("@/hooks/useAuth")>("@/hooks/useAuth");
  return {
    useAuth: () => (useRealAuth ? actual.useAuth() : mockUseAuth()),
  };
});
jest.mock("@/app/services/auth");
jest.mock("@/lib/auth/tokenStorage");

const createStore = (
  authState?: Partial<{
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
  }>,
) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        ...authState,
      },
    },
  });

const renderWithRedux = (
  props: { onClose: () => void; onSuccess?: () => void } = {
    onClose: jest.fn(),
  },
  storeOverride?: ReturnType<typeof createStore>,
) => {
  const store = storeOverride ?? createStore();
  return {
    ...render(
      <Provider store={store}>
        <LoginForm {...props} />
      </Provider>,
    ),
    store,
  };
};

const mockLogin = jest.fn().mockResolvedValue(true);
type UseAuthMockReturn = {
  login: jest.Mock;
  isLoading: boolean;
  error: string | null;
};
const mockUseAuth = jest.fn<UseAuthMockReturn, []>(() => ({
  login: mockLogin,
  isLoading: false,
  error: null,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    useRealAuth = false;
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    useRealAuth = false;
  });

  it("renders username and password inputs", () => {
    renderWithRedux();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders Log in and Close buttons", () => {
    renderWithRedux();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("submits with credentials", async () => {
    const loginMock = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      login: loginMock,
      isLoading: false,
      error: null,
    });

    const user = userEvent.setup();
    renderWithRedux();

    await user.type(screen.getByLabelText(/username/i), "emilys");
    await user.type(screen.getByLabelText(/password/i), "emilyspass");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(loginMock).toHaveBeenCalledWith("emilys", "emilyspass");
  });

  it("shows error when present", () => {
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      isLoading: false,
      error: "Invalid credentials",
    });

    renderWithRedux();
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("calls onClose when Close clicked", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    renderWithRedux({ onClose });
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows error when login fails on submit", async () => {
    useRealAuth = true;
    mockGetTokens.mockReturnValue(null);
    mockAuthApi.login.mockRejectedValue(new Error("Invalid credentials"));

    const store = createStore({ isInitialized: false });
    const user = userEvent.setup();
    renderWithRedux({ onClose: jest.fn() }, store);

    await user.type(screen.getByLabelText(/username/i), "wrong");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid credentials",
      );
    });
  });
});
