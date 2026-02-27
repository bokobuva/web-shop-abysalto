import type { AuthUser, LoginCredentials } from "@/app/shared/types";

type LoginApiResponse = AuthUser & { expiresAt?: number | null };
type RefreshApiResponse = { expiresAt?: number | null };

/** Base URL for API calls. Empty for same-origin relative URLs. */
function getApiBase(): string {
  return "";
}

/**
 * Posts credentials to /api/auth/login. On success, tokens are set as
 * httpOnly cookies by the server. Returns user and optional expiresAt.
 * Throws with API error message when response is not ok.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginApiResponse> {
  const base = getApiBase();
  const response = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
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

  return response.json();
}

export type GetMeResponse = AuthUser & { expiresAt?: number | null };

/**
 * Fetches the current user from /api/auth/me. Cookies are sent automatically.
 * Returns user and optional expiresAt for refresh scheduling.
 * Throws when the response is not ok (e.g. 401).
 */
export async function getMe(): Promise<GetMeResponse> {
  const base = getApiBase();
  const response = await fetch(`${base}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to get user: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refreshes tokens via /api/auth/refresh. Cookies are sent automatically.
 * New tokens are set as httpOnly cookies by the server.
 * Returns expiresAt for scheduling the next refresh.
 */
export async function refreshToken(): Promise<RefreshApiResponse> {
  const base = getApiBase();
  const response = await fetch(`${base}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Clears auth cookies via /api/auth/logout.
 */
export async function logout(): Promise<void> {
  const base = getApiBase();
  await fetch(`${base}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
