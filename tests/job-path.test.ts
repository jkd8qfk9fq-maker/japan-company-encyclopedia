import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JobPath } from "@/components/industry/job-path";
import type { Company, IndustryId } from "@/types/company";

/** 就活で業界を調べる順番 (P2-2): the three largest by latest printed revenue, a link to the diagnosis, no verdict. */
const company = (id: string, revenues: (number | null)[], primary: IndustryId = "automotive", related: IndustryId[] = []): Company =>
  ({
    id,
    name: id.toUpperCase(),
    industries: [
      { industryId: primary, primary: true },
      ...related.map((industryId) => ({ industryId })),
    ],
    financials: revenues.map((revenue, i) => ({ periodEnd: `202${i}-03-31`, revenue })),
  }) as unknown as Company;

describe("JobPath", () => {
  it("compares the three largest by the latest year, skipping companies without a revenue", () => {
    const html = renderToStaticMarkup(
      createElement(JobPath, { industryName: "自動車", industryId: "automotive" as IndustryId, companies: [company("a", [9, 1]), company("b", [5]), company("c", [1, 7]), company("d", [null]), company("e", [3])] }),
    );
    expect(html).toContain('href="/compare?ids=c,b,e"');
    expect(html).toContain("https://shindan.kigyo-hyakka.com/");
    expect(html).not.toMatch(/おすすめ|優良|受かる|有利/);
  });
  it("leaves out the comparison step when fewer than two companies print a revenue", () => {
    const html = renderToStaticMarkup(createElement(JobPath, { industryName: "葬祭", industryId: "funeral-memorial" as IndustryId, companies: [company("a", [1], "funeral-memorial")] }));
    expect(html).not.toContain("/compare");
    expect(html).toContain("企業タイプ診断");
  });
  // Audit part 2, m6: the industry page's list is every RELATED company, so the largest-by-revenue pick
  // must come from the industry's primary members — a giant related only through a side business
  // (日本製鉄 on the IT page) is not this industry's exemplar.
  it("never exemplifies the industry with a company whose primary industry is another one", () => {
    const html = renderToStaticMarkup(
      createElement(JobPath, {
        industryName: "IT",
        industryId: "it" as IndustryId,
        companies: [
          company("giant", [100], "energy", ["it"]),
          company("a", [5], "it"),
          company("b", [3], "it"),
          company("c", [1], "it"),
        ],
      }),
    );
    expect(html).toContain('href="/compare?ids=a,b,c"');
    expect(html).not.toContain("GIANT");
  });
});
