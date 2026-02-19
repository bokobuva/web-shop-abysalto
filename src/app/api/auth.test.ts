import * as authApi from "@/app/api/auth";
import * as tokenStorage from "@/lib/auth/tokenStorage";

const mockFetch = jest.fn();
const mockSetTokens = jest.spyOn(tokenStorage, "setTokens");
const mockClearTokens = jest.spyOn(tokenStorage, "clearTokens");

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockClear();
  mockSetTokens.mockClear();
  mockClearTokens.mockClear();
});

const mockUser = {
  id: 1,
  username: "emilys",
  email: "emily@example.com",
  firstName: "Emily",
  lastName: "Johnson",
  image: "https://example.com/avatar.jpg",
};

describe("login", () => {
  it("returns user and tokens on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockUser,
        accessToken: "access-123",
        refreshToken: "refresh-456",
      }),
    });

    const result = await authApi.login({
      username: "emilys",
      password: "emilyspass",
    });

    expect(result).toEqual({
      ...mockUser,
      accessToken: "access-123",
      refreshToken: "refresh-456",
    });
    expect(mockSetTokens).toHaveBeenCalledWith("access-123", "refresh-456");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/auth/login",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("emilys"),
      }),
    );
  });

  it("throws with API error message on failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    await expect(
      authApi.login({ username: "wrong", password: "wrong" }),
    ).rejects.toThrow("Invalid credentials");
    expect(mockSetTokens).not.toHaveBeenCalled();
  });

  it("throws generic message when API returns non-JSON error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
      json: async () => {
        throw new Error("Parse error");
      },
    });

    await expect(
      authApi.login({ username: "x", password: "y" }),
    ).rejects.toThrow(/Login failed|Unauthorized/);
  });
});

describe("getMe", () => {
  it("returns user when token is valid", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await authApi.getMe("access-123");

    expect(result).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/auth/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer access-123" },
      }),
    );
  });

  it("throws when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
    });

    await expect(authApi.getMe("invalid")).rejects.toThrow(
      "Failed to get user: Unauthorized",
    );
  });
});

describe("refreshToken", () => {
  it("returns new tokens and updates storage", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      }),
    });

    const result = await authApi.refreshToken("refresh-456");

    expect(result).toEqual({
      accessToken: "new-access",
      refreshToken: "new-refresh",
    });
    expect(mockSetTokens).toHaveBeenCalledWith("new-access", "new-refresh");
  });

  it("throws when refresh fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Forbidden",
    });

    await expect(authApi.refreshToken("invalid")).rejects.toThrow(
      "Token refresh failed: Forbidden",
    );
  });
});

describe("logout", () => {
  it("clears tokens", () => {
    authApi.logout();
    expect(mockClearTokens).toHaveBeenCalled();
  });
});
