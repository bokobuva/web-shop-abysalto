"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

type LoginFormProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      onSuccess?.();
      onClose();
    } catch {
      // Error is handled by useAuth and displayed below
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2
        id="login-title"
        className="text-lg font-semibold text-gray-900 dark:text-zinc-50"
      >
        Log in
      </h2>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-username"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
          aria-describedby={error ? "login-error" : undefined}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
          aria-describedby={error ? "login-error" : undefined}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
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
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {isLoading ? "Logging in…" : "Log in"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
