/**
 * @jest-environment node
 */
import { POST } from "../route";

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockClear();
});

describe("POST /api/auth/login", () => {
  it("returns user and sets cookies on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: "emilys",
        email: "emily@example.com",
        firstName: "Emily",
        lastName: "Johnson",
        accessToken: "access-jwt.eyJleHAiOjEyMzQ1Njc4OTB9.x",
        refreshToken: "refresh-xyz",
      }),
    });

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "emilys", password: "emilyspass" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.username).toBe("emilys");
    expect(data).not.toHaveProperty("accessToken");
    expect(data).not.toHaveProperty("refreshToken");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/auth/login",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("emilys"),
      }),
    );
    expect(response.headers.get("set-cookie")).toBeTruthy();
    expect(response.headers.get("set-cookie")).toContain("access_token");
    expect(response.headers.get("set-cookie")).toContain("refresh_token");
  });

  it("returns 400 when username or password missing", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "emilys" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns error status when DummyJSON fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    });

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "wrong", password: "wrong" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toBe("Invalid credentials");
  });
});
