import { describe, expect, it } from "vitest";
import { assetRequest, redirectTarget } from "../worker/index";

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
