import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import type { AuthUser } from "@/app/shared/types";

import { authReducer } from "@/store/authSlice";
import { cartReducer } from "@/store/cartSlice";

import { NavBar } from "../NavBar";

const mockUser: AuthUser = {
  id: 1,
  username: "emilys",
  email: "emily@example.com",
  firstName: "Emily",
  lastName: "Johnson",
  image: "https://example.com/avatar.jpg",
};

const createStore = (
  user: AuthUser | null,
  cartItems: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }[] = [],
) =>
  configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState: {
      auth: {
        user,
        isLoading: false,
        error: null,
        isInitialized: true,
      },
      cart: { items: cartItems },
    },
  });

const renderWithRedux = (
  user: AuthUser | null,
  cartItems: {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }[] = [],
) =>
  render(
    <Provider store={createStore(user, cartItems)}>
      <NavBar />
    </Provider>,
  );

const mockUseAuth = jest.fn();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("NavBar", () => {
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

  it("shows cart badge when cart has items", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isInitialized: true,
    });

    renderWithRedux(null, [
      { productId: "1", quantity: 3, name: "Product", price: 10, image: "" },
    ]);
    expect(screen.getByLabelText(/3 items in cart/i)).toHaveTextContent("3");
  });

  it("hides cart badge when cart is empty", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isInitialized: true,
    });

    renderWithRedux(null);
    expect(
      screen.queryByLabelText(/\d+ items in cart/i),
    ).not.toBeInTheDocument();
  });
});
