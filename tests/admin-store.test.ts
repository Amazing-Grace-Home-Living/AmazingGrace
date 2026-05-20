import { beforeEach, describe, expect, it } from "vitest";
import {
  addStoreItemHandler,
  storeItems,
  validateStoreItemPayload,
} from "../server/admin-store.js";

function createRes() {
  return {
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
}

describe("admin-store", () => {
  beforeEach(() => {
    storeItems.length = 0;
  });

  it("rejects payload when name is missing", () => {
    expect(validateStoreItemPayload({ price: 10 })).toEqual({
      ok: false,
      status: 400,
      error: "name is required",
    });
  });

  it("rejects payload when price is negative", () => {
    expect(validateStoreItemPayload({ name: "Apple", price: -1 })).toEqual({
      ok: false,
      status: 400,
      error: "price must be a non-negative number",
    });
  });

  it("rejects payload when price is not numeric", () => {
    expect(validateStoreItemPayload({ name: "Apple", price: "abc" })).toEqual({
      ok: false,
      status: 400,
      error: "price must be a non-negative number",
    });
  });

  it("creates an item with provided id", () => {
    const result = validateStoreItemPayload({ id: "sku-1", name: "Apple", price: "9.99" });
    expect(result).toEqual({
      ok: true,
      value: {
        id: "sku-1",
        name: "Apple",
        price: 9.99,
      },
    });
  });

  it("adds item successfully via handler", () => {
    const req = { body: { name: "Orange", price: 2 } };
    const res = createRes();
    addStoreItemHandler(req, res);
    expect(res.code).toBe(201);
    expect(storeItems).toHaveLength(1);
    expect(storeItems[0].name).toBe("Orange");
  });
});
