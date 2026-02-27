import * as authApi from "@/app/services/auth";

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockClear();
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
  it("returns user on success and uses credentials", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockUser,
        expiresAt: 1234567890,
      }),
    });

    const result = await authApi.login({
      username: "emilys",
      password: "emilyspass",
    });

    expect(result).toMatchObject(mockUser);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
  it("returns user with credentials", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockUser, expiresAt: 1234567890 }),
    });

    const result = await authApi.getMe();

    expect(result).toMatchObject(mockUser);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      }),
    );
  });

  it("throws when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
    });

    await expect(authApi.getMe()).rejects.toThrow(
      "Failed to get user: Unauthorized",
    );
  });
});

describe("refreshToken", () => {
  it("returns expiresAt with credentials", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expiresAt: 1234567890 }),
    });

    const result = await authApi.refreshToken();

    expect(result).toEqual({ expiresAt: 1234567890 });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/refresh",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );
  });

  it("throws when refresh fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Forbidden",
    });

    await expect(authApi.refreshToken()).rejects.toThrow(
      "Token refresh failed: Forbidden",
    );
  });
});

describe("logout", () => {
  it("calls logout API with credentials", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    await authApi.logout();

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );
  });
});
