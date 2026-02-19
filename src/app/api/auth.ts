import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "@/app/shared/types";
import { clearTokens, setTokens } from "@/lib/auth/tokenStorage";

const AUTH_BASE = "https://dummyjson.com/auth";

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

export function logout(): void {
  clearTokens();
}
