import { getJwtExpiry } from "../serverJwt";

function base64UrlEncode(obj: object): string {
  const json = JSON.stringify(obj);
  return Buffer.from(json, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

describe("getJwtExpiry", () => {
  it("returns exp from valid JWT", () => {
    const header = base64UrlEncode({ alg: "HS256" });
    const payload = base64UrlEncode({ exp: 1234567890, sub: "1" });
    const token = `${header}.${payload}.signature`;
    expect(getJwtExpiry(token)).toBe(1234567890);
  });

  it("returns null for invalid token format", () => {
    expect(getJwtExpiry("invalid")).toBeNull();
    expect(getJwtExpiry("a.b")).toBeNull();
  });

  it("returns null when exp is missing", () => {
    const header = base64UrlEncode({ alg: "HS256" });
    const payload = base64UrlEncode({ sub: "1" });
    const token = `${header}.${payload}.sig`;
    expect(getJwtExpiry(token)).toBeNull();
  });
});
