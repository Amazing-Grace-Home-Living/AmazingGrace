import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  extractAdminCredential,
  isAuthorizedAdminRequest,
  requireAdminApiKey,
} from "../server/admin-auth.js";

describe("admin-auth", () => {
  describe("extractAdminCredential", () => {
    it("reads bearer token from authorization header", () => {
      const req = { headers: { authorization: "Bearer top-secret" } };
      expect(extractAdminCredential(req)).toBe("top-secret");
    });

    it("reads x-admin-api-key when bearer token is missing", () => {
      const req = { headers: { "x-admin-api-key": "header-secret" } };
      expect(extractAdminCredential(req)).toBe("header-secret");
    });
  });

  describe("isAuthorizedAdminRequest", () => {
    it("returns true for a matching bearer token", () => {
      const req = { headers: { authorization: "Bearer abc123" } };
      expect(isAuthorizedAdminRequest(req, "abc123")).toBe(true);
    });

    it("returns false for a non-matching token", () => {
      const req = { headers: { authorization: "Bearer wrong" } };
      expect(isAuthorizedAdminRequest(req, "abc123")).toBe(false);
    });
  });

  describe("requireAdminApiKey", () => {
    const original = process.env.ADMIN_API_KEY;

    beforeEach(() => {
      delete process.env.ADMIN_API_KEY;
    });

    afterEach(() => {
      if (original === undefined) {
        delete process.env.ADMIN_API_KEY;
      } else {
        process.env.ADMIN_API_KEY = original;
      }
    });

    function createRes() {
      const res = {
        code: 200,
        payload: undefined as unknown,
        status(code: number) {
          this.code = code;
          return this;
        },
        json(payload: unknown) {
          this.payload = payload;
          return this;
        },
      };
      return res;
    }

    it("returns 503 when ADMIN_API_KEY is not configured", () => {
      const res = createRes();
      const next = vi.fn();
      requireAdminApiKey({ headers: {} }, res, next);
      expect(res.code).toBe(503);
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 when token is invalid", () => {
      process.env.ADMIN_API_KEY = "expected";
      const res = createRes();
      const next = vi.fn();
      requireAdminApiKey({ headers: { authorization: "Bearer wrong" } }, res, next);
      expect(res.code).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next when token is valid", () => {
      process.env.ADMIN_API_KEY = "expected";
      const res = createRes();
      const next = vi.fn();
      requireAdminApiKey({ headers: { "x-admin-api-key": "expected" } }, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.code).toBe(200);
    });
  });
});
