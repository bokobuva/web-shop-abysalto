"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as authApi from "@/app/services/auth";
import { getJwtExpiry } from "@/lib/auth/jwtUtils";
import { getTokens } from "@/lib/auth/tokenStorage";
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

function scheduleRefresh(callback: () => Promise<void>): number {
  return window.setTimeout(callback, DEFAULT_REFRESH_IN_MS);
}

export function useAuth() {
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

  const performRefresh = useCallback(async () => {
    const tokens = getTokens();
    if (!tokens) return false;
    try {
      const { accessToken } = await authApi.refreshToken(tokens.refreshToken);
      const userData = await authApi.getMe(accessToken);
      dispatch(setUser(userData));
      return true;
    } catch {
      authApi.logout();
      dispatch(setUser(null));
      return false;
    }
  }, [dispatch]);

  const scheduleNextRefresh = useCallback(() => {
    clearRefreshTimeout();
    const tokens = getTokens();
    if (!tokens) return;

    const expiry = getJwtExpiry(tokens.accessToken);
    const nowSec = Math.floor(Date.now() / 1000);
    const msUntilRefresh = expiry
      ? Math.max(0, (expiry - REFRESH_BEFORE_EXPIRY_SEC - nowSec) * 1000)
      : DEFAULT_REFRESH_IN_MS;

    refreshTimeoutRef.current = window.setTimeout(
      async () => {
        refreshTimeoutRef.current = null;
        const ok = await performRefresh();
        if (ok) scheduleNextRefresh();
      },
      Math.min(msUntilRefresh, DEFAULT_REFRESH_IN_MS),
    );
  }, [clearRefreshTimeout, performRefresh]);

  const initializeAuth = useCallback(async () => {
    if (isInitialized) return;
    const tokens = getTokens();
    if (!tokens) {
      dispatch(setUser(null));
      dispatch(setAuthInitialized(true));
      return;
    }
    dispatch(setAuthLoading(true));
    try {
      const userData = await authApi.getMe(tokens.accessToken);
      dispatch(setUser(userData));
      scheduleNextRefresh();
    } catch {
      try {
        const ok = await performRefresh();
        if (ok) {
          scheduleNextRefresh();
        }
      } catch {
        authApi.logout();
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
        const tokens = getTokens();
        if (!tokens) return;
        const expiry = getJwtExpiry(tokens.accessToken);
        if (expiry) {
          const nowSec = Math.floor(Date.now() / 1000);
          if (expiry - nowSec < REFRESH_BEFORE_EXPIRY_SEC) {
            performRefresh().then((ok) => {
              if (ok) scheduleNextRefresh();
            });
          }
        }
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
    async (username: string, password: string) => {
      dispatch(setAuthError(null));
      dispatch(setAuthLoading(true));
      try {
        const data = await authApi.login({ username, password });
        const { accessToken: _a, refreshToken: _r, ...user } = data;
        dispatch(setUser(user));
        scheduleNextRefresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        dispatch(setAuthError(message));
        dispatch(setUser(null));
        throw err;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch, scheduleNextRefresh],
  );

  const logout = useCallback(() => {
    clearRefreshTimeout();
    authApi.logout();
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
