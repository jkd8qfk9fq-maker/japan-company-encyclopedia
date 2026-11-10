import { describe, expect, it } from "vitest";
import { redirectTarget } from "../worker/index";

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
