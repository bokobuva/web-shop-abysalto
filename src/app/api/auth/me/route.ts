import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getJwtExpiry } from "@/lib/auth/serverJwt";

const AUTH_BASE = "https://dummyjson.com/auth";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${AUTH_BASE}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to get user" },
      { status: 401 },
    );
  }

  const user = await response.json();
  const expiresAt = getJwtExpiry(accessToken);
  return NextResponse.json({ ...user, expiresAt });
}
