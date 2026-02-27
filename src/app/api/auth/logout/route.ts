import { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("access_token", "", { ...cookieOptions, maxAge: 0 });
  res.cookies.set("refresh_token", "", { ...cookieOptions, maxAge: 0 });
  return res;
}
