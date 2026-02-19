"use client";

import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { LoginForm } from "@/components/LoginForm";
import { Modal } from "@/components/Modal";

export const AuthBar: React.FC = () => {
  const { user, logout, isInitialized } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              {user.image && (
                <Image
                  src={user.image}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-zinc-50">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Log out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Log in
          </button>
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
