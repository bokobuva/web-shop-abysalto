/**
 * @jest-environment node
 */
import { POST } from "../route";

describe("POST /api/auth/logout", () => {
  it("returns 200 and clears cookies", async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("access_token");
    expect(setCookie).toContain("refresh_token");
    expect(setCookie).toMatch(/maxAge=0|Max-Age=0/);
  });
});
