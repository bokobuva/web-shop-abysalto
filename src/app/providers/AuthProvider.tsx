"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import * as authApi from "@/app/services/auth";
import type { AuthUser } from "@/app/shared/types";
import {
  selectAuthError,
  selectAuthInitialized,
  selectAuthLoading,
  selectAuthUser,
} from "@/store/selectors";
import {
  setAuthError,
  setAuthInitialized,
  setAuthLoading,
  setUser,
} from "@/store";

const REFRESH_BEFORE_EXPIRY_SEC = 5 * 60;
const DEFAULT_REFRESH_IN_MS = 55 * 60 * 1000;

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuthInternal(): AuthContextValue {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isInitialized = useSelector(selectAuthInitialized);

  const refreshTimeoutRef = useRef<number | null>(null);

  const clearRefreshTimeout = useCallback(() => {
    if (refreshTimeoutRef.current !== null) {
      window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  const performRefresh = useCallback(async (): Promise<{
    ok: boolean;
    expiresAt?: number | null;
  }> => {
    try {
      const { expiresAt } = await authApi.refreshToken();
      const userData = await authApi.getMe();
      dispatch(setUser(userData));
      return { ok: true, expiresAt: expiresAt ?? userData.expiresAt };
    } catch {
      await authApi.logout();
      dispatch(setUser(null));
      return { ok: false };
    }
  }, [dispatch]);

  const scheduleNextRefresh = useCallback(
    (expiresAt?: number | null) => {
      clearRefreshTimeout();
      const nowSec = Math.floor(Date.now() / 1000);
      const msUntilRefresh = expiresAt
        ? Math.max(0, (expiresAt - REFRESH_BEFORE_EXPIRY_SEC - nowSec) * 1000)
        : DEFAULT_REFRESH_IN_MS;

      refreshTimeoutRef.current = window.setTimeout(
        async () => {
          refreshTimeoutRef.current = null;
          const result = await performRefresh();
          if (result.ok && result.expiresAt) {
            scheduleNextRefresh(result.expiresAt);
          }
        },
        Math.min(msUntilRefresh, DEFAULT_REFRESH_IN_MS),
      );
    },
    [clearRefreshTimeout, performRefresh],
  );

  const initializeAuth = useCallback(async () => {
    if (isInitialized) return;
    dispatch(setAuthLoading(true));
    try {
      const userData = await authApi.getMe();
      dispatch(setUser(userData));
      scheduleNextRefresh(userData.expiresAt);
    } catch {
      try {
        const result = await performRefresh();
        if (result.ok) {
          scheduleNextRefresh(result.expiresAt);
        } else {
          dispatch(setUser(null));
        }
      } catch {
        dispatch(setUser(null));
      }
    } finally {
      dispatch(setAuthLoading(false));
      dispatch(setAuthInitialized(true));
    }
  }, [dispatch, isInitialized, performRefresh, scheduleNextRefresh]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        performRefresh().then((result) => {
          if (result.ok && result.expiresAt) {
            scheduleNextRefresh(result.expiresAt);
          }
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user, performRefresh, scheduleNextRefresh]);

  useEffect(() => {
    return () => clearRefreshTimeout();
  }, [clearRefreshTimeout]);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      dispatch(setAuthError(null));
      dispatch(setAuthLoading(true));
      try {
        const data = await authApi.login({ username, password });
        const { expiresAt, ...userData } = data;
        dispatch(setUser(userData));
        scheduleNextRefresh(expiresAt);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        dispatch(setAuthError(message));
        dispatch(setUser(null));
        return false;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch, scheduleNextRefresh],
  );

  const logout = useCallback(async () => {
    clearRefreshTimeout();
    await authApi.logout();
    dispatch(setUser(null));
    dispatch(setAuthError(null));
  }, [clearRefreshTimeout, dispatch]);

  return {
    user,
    isLoading,
    error,
    isInitialized,
    login,
    logout,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthInternal();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
