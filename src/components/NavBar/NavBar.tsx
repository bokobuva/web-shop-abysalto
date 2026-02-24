"use client";

import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";

import { useAuth } from "@/hooks/useAuth";
import { selectCartTotalCount } from "@/store/selectors";

import { Button } from "@/components/Button";
import { CartDropdown } from "@/components/CartDropdown";
import { CartIcon } from "@/components/icons";
import { LoginForm } from "@/components/LoginForm";
import { Modal } from "@/components/Modal";

export const NavBar: React.FC = () => {
  const { user, logout, isInitialized } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const cartTotalCount = useSelector(selectCartTotalCount);
  const cartBadgeText = cartTotalCount > 99 ? "99+" : cartTotalCount;
  const { image: userImage, firstName = "", lastName = "" } = user ?? {};

  if (!isInitialized) {
    return (
      <div
        className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
        aria-label="Loading authentication"
      />
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <CartDropdown>
          <div className="relative flex cursor-pointer items-center justify-center text-gray-900 dark:text-zinc-50">
            <CartIcon />
            {cartTotalCount > 0 && (
              <span
                className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white"
                aria-label={`${cartTotalCount} items in cart`}
              >
                {cartBadgeText}
              </span>
            )}
          </div>
        </CartDropdown>
        {user ? (
          <>
            <div className="flex items-center gap-2">
              {userImage && (
                <Image
                  src={userImage}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-zinc-50 hidden sm:block">
                {firstName} {lastName}
              </span>
            </div>
            <Button
              onClick={logout}
              dataTestId="navbar-logout"
              ariaLabel="Log out"
            >
              Log out
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setShowLoginModal(true)}
            dataTestId="navbar-login"
            ariaLabel="Log in"
          >
            Log in
          </Button>
        )}
      </div>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        ariaLabelledBy="login-title"
      >
        <LoginForm
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => setShowLoginModal(false)}
        />
      </Modal>
    </>
  );
};
