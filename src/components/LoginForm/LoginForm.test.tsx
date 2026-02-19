import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

import { authReducer } from "@/store/authSlice";

import { LoginForm } from "./LoginForm";

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
) => {
  const store = createStore();
  return {
    ...render(
      <Provider store={store}>
        <LoginForm {...props} />
      </Provider>,
    ),
    store,
  };
};

const mockLogin = jest.fn().mockResolvedValue(undefined);
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
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  it("renders username and password inputs", () => {
    renderWithRedux();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders Log in and Cancel buttons", () => {
    renderWithRedux();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
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

  it("calls onClose when Cancel clicked", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    renderWithRedux({ onClose });
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
