import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, MIN_SECRET_LENGTH, SESSION_TTL_SECONDS, verifySessionToken } from "./crypto";

/**
 * Admin session handling on top of ./crypto. SERVER ONLY.
 *
 * Configuration (all required; any missing ⇒ admin is closed):
 *   ADMIN_PASSWORD_HASH   from `npm run admin:hash-password`
 *   ADMIN_SESSION_SECRET  ≥ 32 random characters
 */

export const ADMIN_SESSION_COOKIE = "admin-session";

export type AdminConfig = { passwordHash: string; secret: string };

export function getAdminConfig(): AdminConfig | null {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!passwordHash || !secret || secret.length < MIN_SECRET_LENGTH) return null;
  return { passwordHash, secret };
}

export async function isAdmin(): Promise<boolean> {
  // Read the cookie BEFORE checking configuration. Returning early without
  // touching cookies() let Next.js prerender admin pages at build time (as a
  // static redirect) whenever the build ran without admin settings.
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const config = getAdminConfig();
  if (!config) return false;
  return verifySessionToken(token, config.secret);
}

/** For admin pages and every admin Server Action. Server Actions are reachable by direct POST. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startSession(config: AdminConfig): Promise<void> {
  (await cookies()).set(ADMIN_SESSION_COOKIE, createSessionToken(config.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, path: "/admin", maxAge: 0 });
}

/**
 * The requesting client's address, as far as the host reports it. Used only
 * as input to an HMAC for rate limiting, never stored.
 */
export async function clientAddress(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
