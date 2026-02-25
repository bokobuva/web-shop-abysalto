import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/app/shared/constants";

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
} | null;

/**
 * Returns access and refresh tokens from sessionStorage.
 * Returns null if window is undefined (SSR), or if either token is missing.
 */
export function getTokens(): StoredTokens {
  if (typeof window === "undefined") return null;
  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

/**
 * Stores access and refresh tokens in sessionStorage.
 * No-op when window is undefined (SSR).
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Removes access and refresh tokens from sessionStorage.
 * No-op when window is undefined (SSR).
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
