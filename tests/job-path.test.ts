import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JobPath } from "@/components/industry/job-path";
import type { Company } from "@/types/company";

/** 就活で業界を調べる順番 (P2-2): the three largest by latest printed revenue, a link to the diagnosis, no verdict. */
const company = (id: string, revenues: (number | null)[]): Company =>
  ({
    id,
    name: id.toUpperCase(),
    financials: revenues.map((revenue, i) => ({ periodEnd: `202${i}-03-31`, revenue })),
  }) as unknown as Company;

describe("JobPath", () => {
  it("compares the three largest by the latest year, skipping companies without a revenue", () => {
    const html = renderToStaticMarkup(
      createElement(JobPath, { industryName: "自動車", companies: [company("a", [9, 1]), company("b", [5]), company("c", [1, 7]), company("d", [null]), company("e", [3])] }),
    );
    expect(html).toContain('href="/compare?ids=c,b,e"');
    expect(html).toContain("https://shindan.kigyo-hyakka.com/");
    expect(html).not.toMatch(/おすすめ|優良|受かる|有利/);
  });
  it("leaves out the comparison step when fewer than two companies print a revenue", () => {
    const html = renderToStaticMarkup(createElement(JobPath, { industryName: "葬祭", companies: [company("a", [1])] }));
    expect(html).not.toContain("/compare");
    expect(html).toContain("企業タイプ診断");
  });
});
