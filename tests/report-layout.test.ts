import { createElement } from "react";
import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { Donut, TrendChart } from "@/components/company/report-charts";
import { CompanyReport } from "@/components/company/company-report";
import { isReleased } from "@/lib/release";

/**
 * The premium report's layout (JCE-114): charts that draw only the report's own figures, folded tables that are
 * still in the page (so printing can open them), and none of the market figures the reference design showed.
 */

const released = companies.filter(isReleased);
const agc = released.find((c) => c.id === "agc")!;

describe("report charts", () => {
  it("label each year's margin as the printed profit line over printed revenue", () => {
    const html = renderToStaticMarkup(createElement(TrendChart, { records: [...agc.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)) }));
    for (const r of agc.financials) {
      if (r.profit === null || r.revenue === null || r.revenue <= 0) continue;
      expect(html).toContain(`${((r.profit / r.revenue) * 100).toFixed(1)}%`);
    }
  });

  it("give every part its share of the total, largest first, and fold parts past five into one", () => {
    const parts = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ name: `事業${n}`, amount: n * 100 }));
    const html = renderToStaticMarkup(createElement(Donut, { title: "t", parts, unitLabel: "売上高" }));
    expect(html).toContain("事業7");
    expect(html).toContain(`${((700 / 2800) * 100).toFixed(1)}%`);
    expect(html).toContain("その他の2区分");
    expect(html).toContain(`${((300 / 2800) * 100).toFixed(1)}%`);
    expect(html).not.toContain(">事業1<");
  });
});

describe("report page", async () => {
  // The report holds async Server Components (rich text, provenance), so it is rendered as a stream and read whole.
  const stream = await renderToReadableStream(createElement(CompanyReport, { company: agc, companies: released, revisions: [] }));
  await stream.allReady;
  const html = await new Response(stream).text();

  it("lists its chapters in a table of contents that points at real anchors", () => {
    for (const id of ["overview", "performance", "structure", "position", "analysis", "check", "sources"]) {
      expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(`id="${id}"`);
    }
  });

  it("keeps every printed figure in the page, folded under its chart", () => {
    expect(html).toContain("<details");
    const latest = [...agc.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1)!;
    expect(html).toContain(latest.fiscalYear);
  });

  it("draws the five-perspective radar with its explanation", () => {
    expect(html).toContain("5観点の業界内の位置");
    expect(html).toContain("点数ではありません");
  });

  it("shows no market figure (invariant 4)", () => {
    for (const word of ["PER", "PBR", "時価総額", "配当利回り"]) expect(html, word).not.toContain(word);
    // 株価 appears once, in the disclaimer that says the report holds none.
    expect(html.split("株価").length - 1).toBe(1);
    expect(html).toContain("株価・評価・推奨は含みません");
  });
});

describe("five-perspective radar (JCE-115)", async () => {
  const { companyAnalysis } = await import("@/lib/company-analysis");
  const { radarAxes } = await import("@/lib/perspective-radar");

  it("reads each axis from one named row's own industry percentile, never a blend", () => {
    for (const company of released.slice(0, 80)) {
      const analysis = companyAnalysis(company, released);
      const axes = radarAxes(analysis);
      expect(axes.map((a) => a.perspectiveTitle)).toEqual(["規模と地位", "成長", "収益性", "財務の安定", "外部環境との接続"]);
      const rows = analysis.perspectives.flatMap((p) => p.rows);
      for (const a of axes) {
        if (a.percentile === null) continue;
        const row = rows.find((r) => r.key === a.row!.key)!;
        expect(a.percentile, `${company.id} ${a.perspective}`).toBe(row.industry!.percentile);
        expect(a.indicator).toBe(row.title);
        expect(a.percentile).toBeGreaterThanOrEqual(0);
        expect(a.percentile).toBeLessThanOrEqual(100);
      }
    }
  }, 60_000);

  it("falls back in a fixed order only when the first indicator has no distribution", () => {
    const axes = radarAxes(companyAnalysis(agc, released));
    const growth = axes.find((a) => a.perspective === "growth")!;
    expect(["revenue-growth-5y", "revenue-growth-1y"]).toContain(growth.row!.key);
  });
});
