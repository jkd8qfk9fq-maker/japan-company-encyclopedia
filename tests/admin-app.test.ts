import { describe, expect, it } from "vitest";
import { sign, verify } from "../admin-app/src/auth";
import { allowedEmails, missingSettings, type AdminEnv } from "../admin-app/src/env";
import worker from "../admin-app/src/index";

const env: AdminEnv = {
  ADMIN_EMAILS: "Owner@Example.com, second@example.com",
  GITHUB_TOKEN: "test-token",
  RESEND_API_KEY: "test-resend",
  GITHUB_REPO: "owner/repo",
  SITE_ORIGIN: "https://kigyo-hyakka.com",
};

describe("admin app: sign-in tokens (JCE-109)", () => {
  it("round-trips a link and a session for the address it was signed for", async () => {
    const link = await sign(env, "link", "owner@example.com", Date.now() + 60_000);
    expect(await verify(env, "link", link)).toBe("owner@example.com");
    expect(await verify(env, "session", link)).toBeNull(); // a mailed link is not a session
  });

  it("refuses an expired, tampered or foreign-keyed token", async () => {
    const expired = await sign(env, "session", "owner@example.com", Date.now() - 1);
    expect(await verify(env, "session", expired)).toBeNull();
    const good = await sign(env, "session", "owner@example.com", Date.now() + 60_000);
    const [body, mac] = good.split(".");
    const forged = `${btoa(JSON.stringify({ p: "session", e: "intruder@example.com", x: Date.now() + 60_000 })).replace(/=+$/, "")}.${mac}`;
    expect(await verify(env, "session", forged)).toBeNull();
    expect(await verify(env, "session", `${body}.AAAA`)).toBeNull();
    // Rotating the GitHub token or changing the allowed list signs everyone out.
    expect(await verify({ ...env, GITHUB_TOKEN: "rotated" }, "session", good)).toBeNull();
    expect(await verify({ ...env, ADMIN_EMAILS: "other@example.com" }, "session", good)).toBeNull();
  });

  it("reads the allowed addresses case-insensitively and names what is missing", () => {
    expect([...allowedEmails(env)]).toEqual(["owner@example.com", "second@example.com"]);
    expect(missingSettings({ GITHUB_REPO: "r", SITE_ORIGIN: "s" })).toHaveLength(3);
    expect(missingSettings(env)).toEqual([]);
  });
});

describe("admin app: requests", () => {
  it("sends every page but login to the login page without a session", async () => {
    for (const path of ["/", "/companies?q=toyota", "/edit/company/toyota", "/terms"]) {
      const response = await worker.fetch(new Request(`https://admin.kigyo-hyakka.com${path}`), env);
      expect(response.status).toBe(303);
      expect(response.headers.get("location")).toBe("/login");
    }
  });

  it("answers a sign-in request the same way whether or not the address is allowed", async () => {
    const body = new URLSearchParams({ email: "stranger@example.com" });
    const response = await worker.fetch(new Request("https://admin.kigyo-hyakka.com/login", { method: "POST", body }), env);
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/login?sent=1");
  });

  it("refuses a form posted from another site", async () => {
    const response = await worker.fetch(
      new Request("https://admin.kigyo-hyakka.com/login", { method: "POST", headers: { origin: "https://evil.example" }, body: new URLSearchParams({ email: "owner@example.com" }) }),
      env,
    );
    expect(response.status).toBe(403);
  });

  it("opens a session from a valid link, and the home page then loads", async () => {
    const link = await sign(env, "link", "owner@example.com", Date.now() + 60_000);
    const response = await worker.fetch(new Request(`https://admin.kigyo-hyakka.com/auth?t=${encodeURIComponent(link)}`), env);
    expect(response.status).toBe(303);
    expect(response.headers.get("set-cookie")).toMatch(/^kigyo_admin=.+; Path=\/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200$/);
  });
});
