import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  apiRequest,
  ApiRequestError,
  NotAuthorizedError,
} from "../../src/api/apiRequest";

vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("apiRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("unwraps { data } success envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { hello: "world" } }),
      })
    );

    const result = await apiRequest<{ hello: string }>(
      "/test",
      { logout: vi.fn() },
      { method: "GET" }
    );

    expect(result).toEqual({ hello: "world" });
  });

  it("throws NotAuthorizedError on 401 and logs out", async () => {
    const logout = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: { code: "invalid_token", message: "Invalid token" } }),
      })
    );

    await expect(apiRequest("/secure", { logout }, { method: "GET" })).rejects.toBeInstanceOf(NotAuthorizedError);
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("maps backend error envelope to ApiRequestError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({
          error: {
            code: "validation_error",
            message: "Invalid payload",
            details: { field: "description" },
          },
        }),
      })
    );

    await expect(apiRequest("/bad", { logout: vi.fn() }, { method: "GET" })).rejects.toMatchObject({
      name: "ApiRequestError",
      message: "Invalid payload",
      code: "validation_error",
    } as Partial<ApiRequestError>);
  });

  it("throws on malformed success payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ hello: "world" }),
      })
    );

    await expect(apiRequest("/malformed", { logout: vi.fn() }, { method: "GET" })).rejects.toThrow(
      "Malformed API success payload"
    );
  });
});
