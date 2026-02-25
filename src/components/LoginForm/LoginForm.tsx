"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/Button";

type LoginFormProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const errorDescribedBy = error ? "login-error" : undefined;
  const submitButtonText = isLoading ? "Logging in…" : "Log in";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2
        id="login-title"
        className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
      >
        Log in
      </h2>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-username"
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Username
        </label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          disabled={isLoading}
          aria-describedby={errorDescribedBy}
          className="rounded-sm border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={isLoading}
          aria-describedby={errorDescribedBy}
          className="rounded-sm border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </div>
      {error && (
        <p
          id="login-error"
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-sm border-0 bg-neutral-800 px-6 py-2.5 font-medium tracking-wide uppercase text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {submitButtonText}
        </button>
        <Button
          onClick={onClose}
          dataTestId="login-close"
          ariaLabel="Close"
          disabled={isLoading}
        >
          Close
        </Button>
      </div>
    </form>
  );
};
