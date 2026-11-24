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

describe("admin app: behind Cloudflare Access", () => {
  const team = "team.cloudflareaccess.com";
  const aud = "test-aud";
  const accessEnv: AdminEnv = { ...env, RESEND_API_KEY: undefined, ACCESS_TEAM_DOMAIN: team, ACCESS_AUD: aud };
  const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const text = (value: unknown) => b64url(new TextEncoder().encode(JSON.stringify(value)));

  async function setup() {
    const pair = (await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
    const jwk = { ...(await crypto.subtle.exportKey("jwk", pair.publicKey)), kid: "k1" };
    const fetcher = (async () => new Response(JSON.stringify({ keys: [jwk] }))) as unknown as typeof fetch;
    const token = async (claims: Record<string, unknown>) => {
      const head = `${text({ alg: "RS256", kid: "k1" })}.${text(claims)}`;
      const sig = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", pair.privateKey, new TextEncoder().encode(head)));
      return `${head}.${b64url(sig)}`;
    };
    return { fetcher, token };
  }

  it("takes the address from a valid token for this application only", async () => {
    const { accessEmail } = await import("../admin-app/src/access");
    const { fetcher, token } = await setup();
    const exp = Math.floor(Date.now() / 1000) + 600;
    const good = await token({ aud: [aud], iss: `https://${team}`, exp, email: "Owner@example.com" });
    expect(await accessEmail(accessEnv, good, Date.now(), fetcher)).toBe("owner@example.com");
    expect(await accessEmail(accessEnv, await token({ aud: ["other-app"], iss: `https://${team}`, exp, email: "owner@example.com" }), Date.now(), fetcher)).toBeNull();
    expect(await accessEmail(accessEnv, await token({ aud: [aud], iss: `https://${team}`, exp: 1, email: "owner@example.com" }), Date.now(), fetcher)).toBeNull();
    expect(await accessEmail(accessEnv, `${good.slice(0, -4)}AAAA`, Date.now(), fetcher)).toBeNull();
  });

  it("does not ask for the mail key, and refuses a request that did not pass Access", async () => {
    expect(missingSettings(accessEnv)).toEqual([]);
    const response = await worker.fetch(new Request("https://admin.kigyo-hyakka.com/"), accessEnv);
    expect(response.status).toBe(403);
    const login = await worker.fetch(new Request("https://admin.kigyo-hyakka.com/login"), accessEnv);
    expect(login.headers.get("location")).toBe("/");
  });
});

describe("admin app: pages", () => {
  it("lets the browser send this app's own origin with its forms, and nowhere else", async () => {
    const response = await worker.fetch(new Request("https://admin.kigyo-hyakka.com/login"), env);
    expect(response.headers.get("referrer-policy")).toBe("same-origin");
    // A post that says it came from nowhere is still refused.
    const nullOrigin = await worker.fetch(new Request("https://admin.kigyo-hyakka.com/login", { method: "POST", headers: { origin: "null" }, body: new URLSearchParams({ email: "owner@example.com" }) }), env);
    expect(nullOrigin.status).toBe(403);
  });
});
