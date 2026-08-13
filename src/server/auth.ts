import { db } from "./db";

export function hashPassword(password: string): string {
  const salt = crypto.randomUUID();
  const hash = Bun.CryptoHasher.hash("sha256", `${salt}:${password}`, "hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = Bun.CryptoHasher.hash("sha256", `${salt}:${password}`, "hex");
  return candidate === hash;
}

export interface SessionPayload {
  sub: number;
  role: string;
  name: string;
}

const SESSION_SECRET = process.env.SESSION_SECRET ?? "maid2hustle-dev-secret";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function signToken(payload: SessionPayload): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + SESSION_TTL_MS }));
  const sig = Bun.CryptoHasher.hash("sha256", `${header}.${body}.${SESSION_SECRET}`, "base64url");
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): SessionPayload | null {
  const [header, body, sig] = token.split(".");
  if (!header || !body || !sig) return null;
  const expected = Bun.CryptoHasher.hash("sha256", `${header}.${body}.${SESSION_SECRET}`, "base64url");
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(atob(body)) as SessionPayload & { exp: number };
    if (Date.now() > payload.exp) return null;
    return { sub: payload.sub, role: payload.role, name: payload.name };
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string | null) {
  if (!token) return null;
  const payload = verifyToken(token.replace(/^Bearer\s+/i, ""));
  if (!payload) return null;
  const user = db.query("SELECT * FROM users WHERE id = ?").get(payload.sub) as Record<string, unknown> | null;
  if (!user) return null;
  return { ...user, password_hash: undefined };
}

export function publicUser(u: Record<string, unknown>) {
  const { password_hash, ...rest } = u;
  return rest;
}
