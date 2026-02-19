import { getTokens } from "@/lib/auth/tokenStorage";
import * as authApi from "@/app/api/auth";

/**
 * Fetches a URL with the current access token in the Authorization header.
 * On 401, attempts token refresh and retries once.
 * On refresh failure, clears tokens and throws.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const tokens = getTokens();
  const accessToken = tokens?.accessToken;

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && tokens?.refreshToken) {
    try {
      const { accessToken: newToken } = await authApi.refreshToken(
        tokens.refreshToken,
      );
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, { ...options, headers });
    } catch {
      authApi.logout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
}
