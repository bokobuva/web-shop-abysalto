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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            typeof error.message === "string"
              ? error.message
              : `Login failed: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as {
      accessToken: string;
      refreshToken: string;
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      image?: string;
    };

    const expiresAt = getJwtExpiry(data.accessToken);
    const { accessToken, refreshToken, ...user } = data;

    const res = NextResponse.json({ ...user, expiresAt });
    res.cookies.set("access_token", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookies.set("refresh_token", refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
