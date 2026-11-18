import { describe, expect, it } from "vitest";
import { assetRequest, httpsUpgradeTarget, redirectTarget, withSecurityHeaders, withShareImageType } from "../worker/index";

describe("worker redirects", () => {
  it("sends the old workers.dev address and www. to kigyo-hyakka.com, keeping the path", () => {
    expect(redirectTarget("https://nihonkigyohyakka.yugenqjp.workers.dev/companies/toyota/?q=1")).toBe(
      "https://kigyo-hyakka.com/companies/toyota/?q=1",
    );
    expect(redirectTarget("https://www.kigyo-hyakka.com/")).toBe("https://kigyo-hyakka.com/");
  });

  it("serves the site's own address and local previews", () => {
    expect(redirectTarget("https://kigyo-hyakka.com/industries/")).toBeNull();
    expect(redirectTarget("http://localhost:8787/")).toBeNull();
  });
});

describe("assetRequest", () => {
  it("asks for a prefetch file of a dynamic route by its encoded name", () => {
    const request = new Request("https://kigyo-hyakka.com/companies/toyota/__next.companies.$d$company-id.__PAGE__.txt?_rsc=abc", { headers: { rsc: "1" } });
    const out = assetRequest(request);
    expect(out.url).toBe("https://kigyo-hyakka.com/companies/toyota/__next.companies.%24d%24company-id.__PAGE__.txt?_rsc=abc");
    expect(out.headers.get("rsc")).toBe("1");
  });
  it("leaves every other request as it is", () => {
    const request = new Request("https://kigyo-hyakka.com/companies/toyota/__next.companies.%24d%24company-id.__PAGE__.txt");
    expect(assetRequest(request)).toBe(request);
    const page = new Request("https://kigyo-hyakka.com/discover/");
    expect(assetRequest(page)).toBe(page);
  });
});

describe("httpsUpgradeTarget (audit 2026-11-18)", () => {
  it("upgrades plain HTTP to HTTPS, keeping path and query", () => {
    expect(httpsUpgradeTarget("http://kigyo-hyakka.com/companies/toyota/?q=1")).toBe("https://kigyo-hyakka.com/companies/toyota/?q=1");
    expect(httpsUpgradeTarget("http://www.kigyo-hyakka.com/")).toBe("https://www.kigyo-hyakka.com/");
  });
  it("leaves HTTPS and local previews alone", () => {
    expect(httpsUpgradeTarget("https://kigyo-hyakka.com/")).toBeNull();
    expect(httpsUpgradeTarget("http://localhost:8787/")).toBeNull();
    expect(httpsUpgradeTarget("http://127.0.0.1:3000/")).toBeNull();
  });
});

describe("withSecurityHeaders (audit 2026-11-18)", () => {
  it("adds the full header set to a page response", () => {
    const out = withSecurityHeaders("/companies/toyota/", new Response("ok"));
    expect(out.headers.get("strict-transport-security")).toContain("includeSubDomains");
    expect(out.headers.get("x-content-type-options")).toBe("nosniff");
    expect(out.headers.get("x-frame-options")).toBe("DENY");
    expect(out.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
    expect(out.headers.get("content-security-policy-report-only")).toContain("script-src");
  });
  it("gives /sw.js its own no-store rules instead of the generic policy", () => {
    const out = withSecurityHeaders("/sw.js", new Response("js", { headers: { "cache-control": "public, max-age=0" } }));
    expect(out.headers.get("cache-control")).toBe("no-cache, no-store, must-revalidate");
    expect(out.headers.get("content-security-policy")).toBe("default-src 'self'; script-src 'self'");
    expect(out.headers.get("content-type")).toContain("application/javascript");
  });
  it("covers API JSON answers too, without touching their cache rule", () => {
    const out = withSecurityHeaders("/api/push/key", new Response("{}", { headers: { "content-type": "application/json", "cache-control": "no-store" } }));
    expect(out.headers.get("x-content-type-options")).toBe("nosniff");
    expect(out.headers.get("cache-control")).toBe("no-store");
  });
});

describe("withShareImageType", () => {
  it("labels a ranking's share image as PNG, and nothing else", () => {
    const asset = () => new Response("png", { headers: { "content-type": "application/octet-stream", "cache-control": "x" } });
    const image = withShareImageType("/rankings/net-margin/opengraph-image", asset());
    expect(image.headers.get("content-type")).toBe("image/png");
    expect(image.headers.get("cache-control")).toBe("x");
    expect(withShareImageType("/rankings/net-margin/", asset()).headers.get("content-type")).toBe("application/octet-stream");
    expect(withShareImageType("/x/opengraph-image", new Response("no", { status: 404 })).status).toBe(404);
  });
});
