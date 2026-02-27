/**
 * @jest-environment node
 */
import { cookies } from "next/headers";
import { POST } from "../route";

jest.mock("next/headers");

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockClear();
  mockCookies.mockReset();
});

describe("POST /api/auth/refresh", () => {
  it("returns 401 and clears cookies when no refresh token", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toBeTruthy();
  });

  it("returns new expiresAt and sets cookies on success", async () => {
    mockCookies.mockResolvedValue({
      get: jest
        .fn()
        .mockImplementation((name: string) =>
          name === "refresh_token" ? { value: "refresh-xyz" } : undefined,
        ),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: "new-access.eyJleHAiOjEyMzQ1Njc4OTB9.x",
        refreshToken: "new-refresh",
      }),
    });

    const response = await POST();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("expiresAt");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/auth/refresh",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("refresh-xyz"),
      }),
    );
    expect(response.headers.get("set-cookie")).toContain("access_token");
    expect(response.headers.get("set-cookie")).toContain("refresh_token");
  });

  it("returns 401 and clears cookies when refresh fails", async () => {
    mockCookies.mockResolvedValue({
      get: jest
        .fn()
        .mockImplementation((name: string) =>
          name === "refresh_token" ? { value: "expired-refresh" } : undefined,
        ),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    mockFetch.mockResolvedValueOnce({ ok: false });

    const response = await POST();

    expect(response.status).toBe(401);
  });
});
