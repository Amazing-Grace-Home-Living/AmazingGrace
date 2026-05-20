import { randomUUID } from "node:crypto";

// Ephemeral in-memory storage for admin inventory routes.
// Replace with persistent storage before production scale-out.
export const storeItems = [];

export function validateStoreItemPayload(body) {
  const { id, name, price } = body ?? {};

  if (!name || typeof name !== "string") {
    return { ok: false, status: 400, error: "name is required" };
  }

  const parsedPrice = price == null ? null : Number(price);
  if (price != null && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
    return { ok: false, status: 400, error: "price must be a non-negative number" };
  }

  return {
    ok: true,
    value: {
      id: id ? String(id) : randomUUID(),
      name: name.trim(),
      price: parsedPrice,
    },
  };
}

export function listStoreItemsHandler(_req, res) {
  res.json({ ok: true, items: storeItems });
}

export function addStoreItemHandler(req, res) {
  const result = validateStoreItemPayload(req.body);
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  storeItems.push(result.value);
  return res.status(201).json({ ok: true, item: result.value });
}
