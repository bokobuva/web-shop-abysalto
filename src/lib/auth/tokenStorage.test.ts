import { getTokens, setTokens, clearTokens } from "./tokenStorage";

const storage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(storage).forEach((k) => delete storage[k]);
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
    },
    writable: true,
    configurable: true,
  });
});

describe("tokenStorage", () => {
  describe("getTokens", () => {
    it("returns null when no tokens stored", () => {
      expect(getTokens()).toBeNull();
    });

    it("returns tokens when both are stored", () => {
      setTokens("access-123", "refresh-456");
      expect(getTokens()).toEqual({
        accessToken: "access-123",
        refreshToken: "refresh-456",
      });
    });

    it("returns null when only access token is stored", () => {
      (
        window.sessionStorage as unknown as {
          setItem: (k: string, v: string) => void;
        }
      ).setItem("auth_access_token", "access");
      expect(getTokens()).toBeNull();
    });
  });

  describe("setTokens", () => {
    it("stores both tokens", () => {
      setTokens("access-abc", "refresh-xyz");
      expect(getTokens()).toEqual({
        accessToken: "access-abc",
        refreshToken: "refresh-xyz",
      });
    });
  });

  describe("clearTokens", () => {
    it("removes tokens", () => {
      setTokens("a", "r");
      clearTokens();
      expect(getTokens()).toBeNull();
    });
  });
});
