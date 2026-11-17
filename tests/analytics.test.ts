import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cleanAddress, cleanRequest, cookieDomain, cookieString, isGoogleMeasurement, readConsent, secretsIn } from "@/lib/analytics/guard";
import { GA_MEASUREMENT_ID } from "@/lib/site";

/** JCE-056: Google Analytics only after consent, and only the path of a page leaves the browser. */

describe("what may be sent to Google Analytics", () => {
  it("keeps origin, path and campaign tags, and nothing else of an address", () => {
    expect(cleanAddress("https://kigyo-hyakka.com/companies/?q=%E3%83%88%E3%83%A8%E3%82%BF#x")).toBe("https://kigyo-hyakka.com/companies/");
    expect(cleanAddress("https://kigyo-hyakka.com/?utm_source=x&utm_campaign=y&ref=z")).toBe("https://kigyo-hyakka.com/?utm_source=x&utm_campaign=y");
    for (const bad of ["javascript:alert(1)", "", "nonsense", "data:text/html,x"]) expect(cleanAddress(bad)).toBeNull();
  });

  it("treats search terms, tokens and long fragments as secrets, but not an in-page anchor", () => {
    expect(secretsIn("https://kigyo-hyakka.com/search?q=%E3%83%88%E3%83%A8%E3%82%BF")).toEqual(["トヨタ"]);
    expect(secretsIn("https://kigyo-hyakka.com/x?token=abcdefgh123")).toEqual(["abcdefgh123"]);
    expect(secretsIn("https://kigyo-hyakka.com/#b=ANSWERS123")).toEqual(["b=ANSWERS123"]);
    expect(secretsIn("https://kigyo-hyakka.com/#main")).toEqual([]);
  });

  it("checks Google's measurement requests only — not its script, not this site's own calls", () => {
    for (const u of ["https://region1.google-analytics.com/g/collect?v=2", "https://www.googletagmanager.com/td?id=G-X", "https://stats.g.doubleclick.net/g/collect"]) {
      expect(isGoogleMeasurement(u)).toBe(true);
    }
    for (const u of ["https://www.googletagmanager.com/gtag/js?id=G-X", "https://shindan.kigyo-hyakka.com/api/plan", "https://google-analytics.com.evil.example/g/collect", "/companies/"]) {
      expect(isGoogleMeasurement(u, "https://kigyo-hyakka.com/")).toBe(false);
    }
  });

  it("rewrites every address in a request, in the query and in each line of the body", () => {
    const dl = encodeURIComponent("https://kigyo-hyakka.com/search?q=%E3%83%88%E3%83%A8%E3%82%BF#frag");
    const out = cleanRequest(`https://region1.google-analytics.com/g/collect?v=2&en=page_view&dl=${dl}`, `en=scroll&dl=${dl}`, []);
    expect(out && new URL(out.url).searchParams.get("dl")).toBe("https://kigyo-hyakka.com/search");
    expect(out && decodeURIComponent(String(out.body))).not.toMatch(/トヨタ|frag/);
  });

  it("does not send a request that still mentions a secret, or whose body cannot be read", () => {
    expect(cleanRequest(`https://region1.google-analytics.com/g/collect?v=2&ep.search_term=${encodeURIComponent("トヨタ")}`, "", ["トヨタ"])).toBeNull();
    expect(cleanRequest("https://region1.google-analytics.com/g/collect?v=2", "ep.x=abcdefgh123", ["abcdefgh123"])).toBeNull();
    expect(cleanRequest("https://region1.google-analytics.com/g/collect?v=2", new Blob(["x"]), [])).toBeNull();
    expect(cleanRequest("https://region1.google-analytics.com/g/collect?v=2&en=page_view", "", ["トヨタ"])).not.toBeNull();
  });
});

describe("the consent choice", () => {
  it("is shared with the other kigyo-hyakka.com sites through one cookie on the parent domain", () => {
    expect(readConsent("a=1; yugenq_consent_ga=granted")).toBe("granted");
    expect(readConsent("yugenq_consent_ga=denied")).toBe("denied");
    for (const bad of ["", "yugenq_consent_ga=yes", "yugenq_consent_ga_x=granted", "yugenq_consent_analytics=granted"]) expect(readConsent(bad)).toBeNull();
    expect(cookieDomain("kigyo-hyakka.com")).toBe(".kigyo-hyakka.com");
    expect(cookieDomain("shindan.kigyo-hyakka.com")).toBe(".kigyo-hyakka.com");
    for (const other of ["localhost", "evilkigyo-hyakka.com", "kigyo-hyakka.com.evil.example"]) expect(cookieDomain(other)).toBeNull();
    expect(cookieString("yugenq_consent_ga", "granted", { hostname: "kigyo-hyakka.com", secure: true, maxAge: 31536000 })).toBe(
      "yugenq_consent_ga=granted; Path=/; Max-Age=31536000; SameSite=Lax; Domain=.kigyo-hyakka.com; Secure",
    );
  });

  it("loads Google's tag only after 「同意する」, with advertising signals off", () => {
    const runtime = readFileSync("src/lib/analytics/runtime.ts", "utf8");
    expect(runtime).toMatch(/if \(started \|\| !gaConfigured\(\) \|\| consentSnapshot\(\) !== "granted"\) return;/);
    expect(runtime).toContain("allow_google_signals: false");
    expect(runtime).toContain('ad_storage: "denied"');
    expect(runtime).toContain("send_page_view: false");
  });

  it("holds an empty or valid measurement ID, and the privacy policy describes Google Analytics whenever it is set", () => {
    expect(GA_MEASUREMENT_ID === "" || /^G-[A-Z0-9]{4,16}$/.test(GA_MEASUREMENT_ID)).toBe(true);
    const privacy = readFileSync("src/app/privacy/page.tsx", "utf8");
    for (const phrase of ["GA_MEASUREMENT_ID", "Google LLC", "yugenq_consent_ga", "オプトアウト", "検索した言葉"]) expect(privacy, phrase).toContain(phrase);
  });
});
