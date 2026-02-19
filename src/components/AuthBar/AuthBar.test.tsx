import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

import { authReducer } from "@/store/authSlice";

import { AuthBar } from "./AuthBar";

const mockUser: AuthUser = {
  id: 1,
  username: "emilys",
  email: "emily@example.com",
  firstName: "Emily",
  lastName: "Johnson",
  image: "https://example.com/avatar.jpg",
};

const createStore = (user: AuthUser | null) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user,
        isLoading: false,
        error: null,
        isInitialized: true,
      },
    },
  });

const renderWithRedux = (user: AuthUser | null) =>
  render(
    <Provider store={createStore(user)}>
      <AuthBar />
    </Provider>,
  );

const mockUseAuth = jest.fn();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("AuthBar", () => {
  it("shows Log in when user is null", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isInitialized: true,
    });

    renderWithRedux(null);
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows user name and Log out when authenticated", () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isInitialized: true,
    });

    renderWithRedux(mockUser);
    expect(screen.getByText(/Emily Johnson/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
  });

  it("calls logout when Log out clicked", async () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isInitialized: true,
    });

    const user = userEvent.setup();
    renderWithRedux(mockUser);
    await user.click(screen.getByRole("button", { name: /log out/i }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("shows loading placeholder when not initialized", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isInitialized: false,
    });

    renderWithRedux(null);
    expect(
      screen.getByLabelText(/loading authentication/i),
    ).toBeInTheDocument();
  });
});
