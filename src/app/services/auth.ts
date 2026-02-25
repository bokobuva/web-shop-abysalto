import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "@/app/shared/types";
import { clearTokens, setTokens } from "@/lib/auth/tokenStorage";

const AUTH_BASE = "https://dummyjson.com/auth";

/**
 * Posts credentials to DummyJSON /auth/login.
 * On success, stores tokens in sessionStorage and returns user + tokens.
 * Throws with API error message or status text when response is not ok.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      typeof error.message === "string"
        ? error.message
        : `Login failed: ${response.statusText}`,
    );
  }

  const data: LoginResponse = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

/**
 * Fetches the current user from DummyJSON /auth/me using the access token.
 * Throws when the response is not ok.
 */
export async function getMe(accessToken: string): Promise<AuthUser> {
  const response = await fetch(`${AUTH_BASE}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user: ${response.statusText}`);
  }

  return response.json();
}

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Refreshes tokens via DummyJSON /auth/refresh.
 * Stores new tokens in sessionStorage and returns them.
 * Throws when refresh fails.
 */
export async function refreshToken(
  refreshTokenValue: string,
): Promise<RefreshResponse> {
  const response = await fetch(`${AUTH_BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: refreshTokenValue,
      expiresInMins: 60,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  const data: RefreshResponse = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

/**
 * Clears access and refresh tokens from sessionStorage.
 */
export function logout(): void {
  clearTokens();
}
