import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  hashPassword,
  SESSION_TTL_SECONDS,
  submitterKey,
  verifyPassword,
  verifySessionToken,
} from "@/lib/admin/crypto";

const SECRET = "x".repeat(40);

describe("password hashing", () => {
  it("verifies the right password and rejects a wrong one", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(stored.startsWith("scrypt:32768:8:1:")).toBe(true);
    // No "$": Next.js expands "$NAME" in .env files and would corrupt the value.
    expect(stored).not.toContain("$");
    expect(await verifyPassword("correct horse battery", stored)).toBe(true);
    expect(await verifyPassword("correct horse batterx", stored)).toBe(false);
  });

  it("salts: the same password hashes differently each time", async () => {
    expect(await hashPassword("same password here")).not.toBe(await hashPassword("same password here"));
  });

  it.each([
    "",
    "plaintext-password",
    "scrypt:1:8:1:c2FsdA:aGFzaA", // N far below the floor
    "scrypt:999999999:8:1:c2FsdA:aGFzaA", // N large enough to exhaust memory
    "bcrypt:10:8:1:c2FsdA:aGFzaA",
    "scrypt$32768$8$1$c2FsdA$aGFzaA", // the old "$" format is not accepted
  ])("rejects a malformed or dangerous stored hash: %s", async (stored) => {
    expect(await verifyPassword("anything", stored)).toBe(false);
  });
});

describe("session tokens", () => {
  const now = 1_800_000_000;

  it("accepts a fresh token", () => {
    expect(verifySessionToken(createSessionToken(SECRET, now), SECRET, now + 60)).toBe(true);
  });

  it("rejects an expired token", () => {
    expect(verifySessionToken(createSessionToken(SECRET, now), SECRET, now + SESSION_TTL_SECONDS + 1)).toBe(false);
  });

  it("rejects a token signed with another secret", () => {
    expect(verifySessionToken(createSessionToken("y".repeat(40), now), SECRET, now)).toBe(false);
  });

  it("rejects a token whose expiry was extended by hand", () => {
    const [v, , mac] = createSessionToken(SECRET, now).split(".");
    expect(verifySessionToken(`${v}.${now + 10 * SESSION_TTL_SECONDS}.${mac}`, SECRET, now)).toBe(false);
  });

  it("rejects a token signed with the raw secret instead of the derived session key", () => {
    // Guards key separation: a MAC made for another purpose must not pass as a session.
    const payload = `v1.${now + 3600}`;
    const mac = createHmac("sha256", SECRET).update(payload).digest("base64url");
    expect(verifySessionToken(`${payload}.${mac}`, SECRET, now)).toBe(false);
  });

  it.each([undefined, "", "v1", "v2.1900000000.abc", "v1.notanumber.abc"])("rejects garbage: %s", (token) => {
    expect(verifySessionToken(token, SECRET, now)).toBe(false);
  });
});

describe("submitterKey", () => {
  it("is stable per address, differs across addresses, and does not contain the address", () => {
    const a = submitterKey(SECRET, "203.0.113.7");
    expect(submitterKey(SECRET, "203.0.113.7")).toBe(a);
    expect(submitterKey(SECRET, "203.0.113.8")).not.toBe(a);
    expect(a).not.toContain("203");
  });
});
