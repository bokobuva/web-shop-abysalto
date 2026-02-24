import { getJwtExpiry } from "../jwtUtils";

function base64UrlEncode(obj: object): string {
  const json = JSON.stringify(obj);
  const base64 = btoa(json);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function createJwt(exp: number): string {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
  const payload = base64UrlEncode({ sub: "1", exp, iat: exp - 3600 });
  return `${header}.${payload}.signature`;
}

describe("getJwtExpiry", () => {
  it("returns exp from valid JWT payload", () => {
    const exp = 1735689600;
    const token = createJwt(exp);
    expect(getJwtExpiry(token)).toBe(exp);
  });

  it("returns null for invalid token format", () => {
    expect(getJwtExpiry("")).toBeNull();
    expect(getJwtExpiry("single")).toBeNull();
    expect(getJwtExpiry("one.two")).toBeNull();
  });

  it("returns null for malformed payload", () => {
    expect(getJwtExpiry("a.invalid-base64!!!.c")).toBeNull();
  });

  it("returns null when exp is missing", () => {
    const payload = base64UrlEncode({ sub: "1" });
    expect(getJwtExpiry(`header.${payload}.sig`)).toBeNull();
  });

  it("returns null when exp is not a number", () => {
    const payload = base64UrlEncode({ exp: "not-a-number" });
    expect(getJwtExpiry(`header.${payload}.sig`)).toBeNull();
  });
});
