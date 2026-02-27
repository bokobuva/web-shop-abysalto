import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getJwtExpiry } from "@/lib/auth/serverJwt";

const AUTH_BASE = "https://dummyjson.com/auth";
const ACCESS_TOKEN_MAX_AGE = 60 * 10; // 10 min
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function clearAuthCookies(response: NextResponse) {
  response.cookies.set("access_token", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("refresh_token", "", { ...cookieOptions, maxAge: 0 });
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    const res = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }

  const response = await fetch(`${AUTH_BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken,
      expiresInMins: 60,
    }),
  });

  if (!response.ok) {
    const res = NextResponse.json(
      { message: "Token refresh failed" },
      { status: 401 },
    );
    clearAuthCookies(res);
    return res;
  }

  const data = (await response.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  const expiresAt = getJwtExpiry(data.accessToken);

  const res = NextResponse.json({ expiresAt });
  res.cookies.set("access_token", data.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookies.set("refresh_token", data.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  return res;
}
