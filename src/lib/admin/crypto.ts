import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Pure cryptography for the admin: password hashing, session tokens and the
 * report-sender key. SERVER ONLY. No Next.js imports, so it is unit-tested
 * directly.
 *
 * There is exactly one editor (the operator), so authentication is one
 * password, not an identity provider. What matters is that it fails closed and
 * that nothing secret is stored or compared in a way that leaks.
 */

function scrypt(password: string, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scryptCallback(password, salt, keylen, options, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

const SCRYPT = { N: 32768, r: 8, p: 1, keylen: 32, maxmem: 64 * 1024 * 1024 } as const;

/**
 * Format: scrypt:N:r:p:saltBase64url:hashBase64url
 *
 * Colon-separated, not the conventional "$": Next.js expands "$NAME" when it
 * loads .env files (and so does a shell), which silently corrupted a
 * "$"-separated hash so the right password never matched. Base64url never
 * contains ":".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, maxmem: SCRYPT.maxmem });
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64url"), key.toString("base64url")].join(":");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltText, hashText] = parts;
  const N = Number(n);
  const expected = Buffer.from(hashText, "base64url");
  // Refuse parameters that would make a crafted hash string a denial of service.
  if (!Number.isInteger(N) || N < 16384 || N > 1048576 || expected.length !== SCRYPT.keylen) return false;
  const key = await scrypt(password, Buffer.from(saltText, "base64url"), expected.length, {
    N,
    r: Number(r),
    p: Number(p),
    maxmem: SCRYPT.maxmem,
  });
  return timingSafeEqual(key, expected);
}

/** Separate keys for separate purposes, all derived from the one secret. */
function derive(secret: string, purpose: string): Buffer {
  return createHmac("sha256", secret).update(`japan-company-encyclopedia:${purpose}`).digest();
}

export const SESSION_TTL_SECONDS = 12 * 60 * 60;

/** Token format: v1.<expiresEpochSeconds>.<hmac>. Stateless: logging out deletes the cookie. */
export function createSessionToken(secret: string, nowSeconds = Math.floor(Date.now() / 1000)): string {
  const payload = `v1.${nowSeconds + SESSION_TTL_SECONDS}`;
  const mac = createHmac("sha256", derive(secret, "admin-session")).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifySessionToken(token: string | undefined, secret: string, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const expires = Number(parts[1]);
  if (!Number.isInteger(expires) || expires <= nowSeconds) return false;
  const expected = createHmac("sha256", derive(secret, "admin-session")).update(`v1.${parts[1]}`).digest();
  const actual = Buffer.from(parts[2], "base64url");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/**
 * An irreversible key per report sender, for rate limiting only. The raw IP
 * address is never stored; without the secret the key cannot be linked back.
 */
export function submitterKey(secret: string, clientAddress: string): string {
  return createHmac("sha256", derive(secret, "report-submitter")).update(clientAddress).digest("base64url");
}

/** A secret shorter than this is treated as unset: fail closed rather than sign with something guessable. */
export const MIN_SECRET_LENGTH = 32;
