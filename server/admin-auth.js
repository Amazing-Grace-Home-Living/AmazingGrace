import { timingSafeEqual } from "node:crypto";

function secureEqual(a, b) {
  const aBuffer = Buffer.from(String(a));
  const bBuffer = Buffer.from(String(b));
  const maxLength = Math.max(aBuffer.length, bBuffer.length, 1);
  const aPadded = Buffer.alloc(maxLength);
  const bPadded = Buffer.alloc(maxLength);
  aBuffer.copy(aPadded);
  bBuffer.copy(bPadded);
  return timingSafeEqual(aPadded, bPadded) && aBuffer.length === bBuffer.length;
}

function readHeader(req, name) {
  if (typeof req?.get === "function") return req.get(name);
  const headers = req?.headers ?? {};
  const direct = headers[name];
  if (direct != null) return direct;
  const lower = headers[name.toLowerCase()];
  return lower ?? null;
}

export function extractAdminCredential(req) {
  const authHeader = readHeader(req, "authorization");
  if (typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  const apiKeyHeader = readHeader(req, "x-admin-api-key");
  if (typeof apiKeyHeader === "string") {
    const token = apiKeyHeader.trim();
    if (token) return token;
  }

  return "";
}

export function isAuthorizedAdminRequest(req, expectedSecret) {
  const expected = String(expectedSecret ?? process.env.ADMIN_API_KEY ?? "").trim();
  if (!expected) return false;

  const provided = extractAdminCredential(req);
  if (!provided) return false;

  return secureEqual(expected, provided);
}

export function requireAdminApiKey(req, res, next) {
  const expected = String(process.env.ADMIN_API_KEY ?? "").trim();
  if (!expected) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (!isAuthorizedAdminRequest(req, expected)) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  return next();
}
