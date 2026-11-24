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

describe("admin console: dashboard figures (2026-11-24)", () => {
  it("reads revision file names into day, kind and the rest, newest first", async () => {
    const { parseRevisionNames } = await import("../admin-app/src/dashboard");
    const refs = parseRevisionNames(["2026-11-01-company-toyota-abc123", "2026-11-24-term-ebitda-1a2b3c", "not-a-revision", "2026-11-24-company-zero-quarterly-added"]);
    expect(refs.map((r) => r.name)).toEqual(["2026-11-24-term-ebitda-1a2b3c", "2026-11-24-company-zero-quarterly-added", "2026-11-01-company-toyota-abc123"]);
    expect(refs[2]).toMatchObject({ day: "2026-11-01", kind: "company", rest: "toyota-abc123" });
  });

  it("counts by month for the last twelve months, empty months included", async () => {
    const { monthlyCounts, parseRevisionNames } = await import("../admin-app/src/dashboard");
    const rows = monthlyCounts(parseRevisionNames(["2026-11-02-company-a-1", "2026-11-03-term-b-2", "2025-12-01-industry-c-3", "2025-11-30-company-old-4"]), "2026-11-24");
    expect(rows).toHaveLength(12);
    expect(rows[0]!.month).toBe("2025-12");
    expect(rows[0]).toMatchObject({ industry: 1, company: 0 });
    expect(rows.at(-1)).toMatchObject({ month: "2026-11", company: 1, term: 1 });
    expect(rows.reduce((s, r) => s + r.company + r.term + r.industry, 0)).toBe(3); // 2025-11 is outside the window
  });

  it("says a figure could not be read instead of showing a number", async () => {
    const { renderDashboard } = await import("../admin-app/src/dashboard");
    const failed = { ok: false as const, error: "GitHub 500" };
    const html = renderDashboard(
      { at: Date.now(), today: "2026-11-24", companyFiles: failed, published: failed, terms: failed, revisions: failed, pulls: failed, recent: failed, github: { ok: false, error: "GitHub 500" } },
      { email: "owner@example.com", expires: null },
      env,
    );
    expect(html.match(/取得できません/g)!.length).toBeGreaterThanOrEqual(5);
    expect(html).not.toMatch(/\d{1,3},\d{3}/); // no figure appears when none could be read
  });
});

describe("admin console: roles and merging (stage 3)", () => {
  const roles: AdminEnv = { ...env, ADMIN_EMAILS: "editor@example.com", APPROVER_EMAILS: "boss@example.com", VIEWER_EMAILS: "reader@example.com" };

  it("gives each address its highest role, and lets all three sign in", async () => {
    const { roleOf } = await import("../admin-app/src/env");
    expect(roleOf(roles, "Boss@example.com")).toBe("approver");
    expect(roleOf(roles, "editor@example.com")).toBe("editor");
    expect(roleOf(roles, "reader@example.com")).toBe("viewer");
    expect(roleOf(roles, "stranger@example.com")).toBeNull();
    expect([...allowedEmails(roles)].sort()).toEqual(["boss@example.com", "editor@example.com", "reader@example.com"]);
  });

  it("keeps a viewer out of every write", async () => {
    const session = await sign(roles, "session", "reader@example.com", Date.now() + 60_000);
    const cookie = `kigyo_admin=${session}`;
    for (const [method, path] of [["POST", "/edit/company/toyota"], ["GET", "/new/term?id=x"], ["POST", "/approvals/1/merge"]] as const) {
      const response = await worker.fetch(new Request(`https://admin.kigyo-hyakka.com${path}`, { method, headers: { cookie, origin: "https://admin.kigyo-hyakka.com" }, body: method === "POST" ? new URLSearchParams({}) : undefined }), roles);
      expect(response.status).toBe(403);
    }
  });

  it("lists why a pull request cannot be merged, and nothing when it can", async () => {
    const { mergeBlockers } = await import("../admin-app/src/github");
    const ready = { number: 1, title: "t", body: "", url: "", state: "open", merged: false, draft: false, mergeable: true, mergeableState: "clean", author: "a", branch: "admin/x", sha: "abc", created: "", files: [], runs: [], checks: "passed" as const };
    expect(mergeBlockers(ready)).toEqual([]);
    expect(mergeBlockers({ ...ready, checks: "failed" })).toContain("テストが失敗しています。");
    expect(mergeBlockers({ ...ready, checks: "none" })).toContain("テストの結果がありません。");
    expect(mergeBlockers({ ...ready, mergeable: false, mergeableState: "dirty" })).toContain("main と食い違いがあり、このままではマージできません。");
    expect(mergeBlockers({ ...ready, state: "closed", merged: true })).toContain("すでにマージされています。");
  });
});

describe("admin console: company sections (stage 4)", () => {
  const toyota = async () => JSON.parse((await import("node:fs")).readFileSync("src/data/companies/toyota.json", "utf8")) as Record<string, unknown>;
  const form = (entries: [string, string][]) => {
    const f = new FormData();
    for (const [k, v] of entries) f.append(k, v);
    return f;
  };

  it("changes only the basic fields, and the draft passes the same review as the JSON editor", async () => {
    const { applySection } = await import("../admin-app/src/company-form");
    const { previewEdit } = await import("../src/lib/content/content-edit");
    const current = await toyota();
    const draft = applySection("basic", current, form([["name", String(current.name)], ["officialName", String(current.officialName)], ["nameEn", String(current.nameEn)], ["shortNameEn", ""], ["description", String(current.description)]]));
    expect(draft.shortNameEn).toBeUndefined();
    expect(draft.businesses).toEqual(current.businesses);
    const companyIds = new Set((await import("node:fs")).readdirSync("src/data/companies").filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)));
    const termIds = new Set((await import("node:fs")).readdirSync("src/data/terms").map((f) => f.slice(0, -5)));
    const preview = previewEdit("company", "toyota", current, draft, { companyIds, termIds, featureIds: new Set() });
    expect(preview.ok ? [] : preview.errors).toEqual([]);
    if (preview.ok) expect(preview.changes.map((c) => c.field)).toEqual(["shortNameEn"]);
    // A form cannot get past a rule the JSON editor enforces: the description stays one sentence.
    const twoSentences = applySection("basic", current, form([["name", String(current.name)], ["officialName", String(current.officialName)], ["description", `${current.description}もう一文。`]]));
    const refused = previewEdit("company", "toyota", current, twoSentences, { companyIds, termIds, featureIds: new Set() });
    expect(refused.ok).toBe(false);
  });

  it("adds a history event only with a year, title, description and a source; deletes on request", async () => {
    const { applySection } = await import("../admin-app/src/company-form");
    const current = await toyota();
    const events = current.history as { year: number; title: string; description: string; significance?: string; sourceIds: string[] }[];
    const keep = (i: number): [string, string][] => [[`h${i}_year`, String(events[i]!.year)], [`h${i}_title`, events[i]!.title], [`h${i}_description`, events[i]!.description], [`h${i}_significance`, events[i]!.significance ?? ""], ...events[i]!.sourceIds.map((s): [string, string] => [`h${i}_src`, s])];
    const all = events.flatMap((_, i) => keep(i));
    const noSource = applySection("history", current, form([...all, ["hnew_year", "2030"], ["hnew_title", "t"], ["hnew_description", "d"]]));
    expect((noSource.history as unknown[]).length).toBe(events.length);
    const added = applySection("history", current, form([...all, ["h0_delete", "1"], ["hnew_year", "2030"], ["hnew_title", "t"], ["hnew_description", "d"], ["hnew_src", "yuho-2026"]]));
    const list = added.history as { year: number }[];
    expect(list.length).toBe(events.length);
    expect(list.at(-1)!.year).toBe(2030);
  });

  it("sets industries with one primary, and adds or removes sources", async () => {
    const { applySection } = await import("../admin-app/src/company-form");
    const current = await toyota();
    const ind = applySection("industries", current, form([["ind0", "automotive"], ["ind1", "finance"], ["ind2", "automotive"], ["primary", "0"]]));
    expect(ind.industries).toEqual([{ industryId: "automotive", primary: true }, { industryId: "finance" }]);
    const sources = current.sources as { id: string; title?: string; publisher?: string; url?: string; publishedAt?: string; accessedAt?: string }[];
    const keep = sources.flatMap((s, i) => (["title", "publisher", "url", "publishedAt", "accessedAt"] as const).map((k): [string, string] => [`s${i}_${k}`, s[k] ?? ""]));
    const next = applySection("sources", current, form([...keep, ["s0_delete", "1"], ["snew_id", "new-source"], ["snew_title", "新しい資料"]]));
    const ids = (next.sources as { id: string }[]).map((s) => s.id);
    expect(ids).not.toContain(sources[0]!.id);
    expect(ids.at(-1)).toBe("new-source");
  });
});
