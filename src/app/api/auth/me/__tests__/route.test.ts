/**
 * @jest-environment node
 */
import { cookies } from "next/headers";
import { GET } from "../route";

jest.mock("next/headers");

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockClear();
  mockCookies.mockReset();
});

describe("GET /api/auth/me", () => {
  it("returns 401 when no access token cookie", async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns user when token is valid", async () => {
    mockCookies.mockResolvedValue({
      get: jest
        .fn()
        .mockImplementation((name: string) =>
          name === "access_token" ? { value: "valid-token" } : undefined,
        ),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        username: "emilys",
        email: "emily@example.com",
        firstName: "Emily",
        lastName: "Johnson",
      }),
    });

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.username).toBe("emilys");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/auth/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer valid-token" },
      }),
    );
  });

  it("returns 401 when DummyJSON rejects", async () => {
    mockCookies.mockResolvedValue({
      get: jest
        .fn()
        .mockImplementation((name: string) =>
          name === "access_token" ? { value: "invalid-token" } : undefined,
        ),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    mockFetch.mockResolvedValueOnce({ ok: false });

    const response = await GET();

    expect(response.status).toBe(401);
  });
});
