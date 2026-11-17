import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { companyRepository } from "@/lib/repositories";
import { buildIndustryFigures, type IndustryFigures, type IndustryFiguresData } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { buildRanking, buildRankings, MIN_COMPANIES, RANKING_IDS, SHARE_IMAGE_TEXT } from "@/lib/rankings";

/**
 * 業界ランキング (JCE-062): an order over figures the industry pages already compute. Checked here against sums and
 * medians taken straight from the data files, not through the code under test.
 */

const industry = (id: string, name: string, ratio: { value: number; companies: number } | null): IndustryFigures =>
  ({ id, name, netProfitMargin: ratio ? { ...ratio, formula: "" } : null, fiscalYears: [] }) as unknown as IndustryFigures;
const data = (industries: IndustryFigures[]) => ({ industries, indexes: { employees: { industries: [] } } }) as unknown as IndustryFiguresData;

describe("buildRanking", () => {
  it("orders by value, shares a rank on a tie, and lists thin or missing industries apart", () => {
    const r = buildRanking(
      "net-margin",
      data([
        industry("a", "あ", { value: 0.05, companies: 10 }),
        industry("b", "い", { value: 0.08, companies: 10 }),
        industry("c", "う", { value: 0.05, companies: 7 }),
        industry("d", "え", { value: 0.5, companies: MIN_COMPANIES - 1 }),
        industry("e", "お", null),
      ]),
    );
    expect(r.rows.map((x) => [x.rank, x.id])).toEqual([[1, "b"], [2, "a"], [2, "c"]]);
    expect(r.excluded).toEqual([{ id: "d", name: "え", companies: MIN_COMPANIES - 1 }, { id: "e", name: "お", companies: 0 }]);
    expect(r.format(0.0512)).toBe("5.1%");
  });
});

describe("wording", () => {
  it("states an order, never a verdict", () => {
    const text = readFileSync("src/lib/rankings.ts", "utf8") + readFileSync("src/app/rankings/page.tsx", "utf8") + readFileSync("src/app/rankings/[ranking-id]/page.tsx", "utf8");
    expect(text).not.toMatch(/おすすめ|優良|強い業界|勝ち組|負け組|買い|投資判断に/);
  });
});

/** Code points in a TrueType cmap (formats 4 and 12), read without a font library. */
function cmapCodePoints(buf: Buffer): Set<number> {
  const tables = buf.readUInt16BE(4);
  let cmap = -1;
  for (let i = 0; i < tables; i++) if (buf.toString("ascii", 12 + i * 16, 16 + i * 16) === "cmap") cmap = buf.readUInt32BE(12 + i * 16 + 8);
  const out = new Set<number>();
  const n = buf.readUInt16BE(cmap + 2);
  for (let i = 0; i < n; i++) {
    const sub = cmap + buf.readUInt32BE(cmap + 4 + i * 8 + 4);
    const format = buf.readUInt16BE(sub);
    if (format === 4) {
      const segs = buf.readUInt16BE(sub + 6) / 2;
      for (let s = 0; s < segs; s++) {
        const end = buf.readUInt16BE(sub + 14 + s * 2);
        const start = buf.readUInt16BE(sub + 16 + segs * 2 + s * 2);
        for (let c = start; c <= end && c !== 0xffff; c++) out.add(c);
      }
    } else if (format === 12) {
      const groups = buf.readUInt32BE(sub + 12);
      for (let g = 0; g < groups; g++) for (let c = buf.readUInt32BE(sub + 16 + g * 12); c <= buf.readUInt32BE(sub + 20 + g * 12); c++) out.add(c);
    }
  }
  return out;
}

describe("share-image font", () => {
  it("has every character the share images draw (re-subset per src/assets/fonts/og/SOURCES.md if not)", () => {
    const covered = cmapCodePoints(readFileSync("src/assets/fonts/og/noto-sans-jp-bold-subset.ttf"));
    const text = [...SHARE_IMAGE_TEXT, ...Object.values(INDUSTRY_LABELS).map((l) => l.name)].join("");
    const missing = [...new Set(text)].filter((ch) => !covered.has(ch.codePointAt(0)!));
    expect(missing).toEqual([]);
  });
});

describe("the published rankings, against the data files", async () => {
  const released = await companyRepository.list();
  const figures = buildIndustryFigures(released);
  const rankings = buildRankings(figures);

  type Raw = {
    industries: { industryId: string; primary?: boolean }[];
    financials: { periodEnd: string; revenue: number | null; netIncome: number | null; employees: number | null }[];
    regionalRevenue?: { items: { amount: number; domestic: boolean }[] };
  };
  const raws = released.map((c) => JSON.parse(readFileSync(`src/data/companies/${c.id}.json`, "utf8")) as Raw);
  const primary = (r: Raw) => (r.industries.find((i) => i.primary) ?? r.industries[0])?.industryId;
  const of = (id: string) => raws.filter((r) => primary(r) === id);
  const sorted = (r: Raw) => [...r.financials].sort((a, b) => (a.periodEnd < b.periodEnd ? -1 : 1));
  const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
  };

  it("builds all four, each with ranked industries", () => {
    expect(rankings.map((r) => r.id)).toEqual([...RANKING_IDS]);
    for (const r of rankings) expect(r.rows.length).toBeGreaterThan(3);
  });

  it("純利益率: the top three equal Σ純利益 ÷ Σ売上高 of the latest year", () => {
    for (const row of rankings.find((r) => r.id === "net-margin")!.rows.slice(0, 3)) {
      const latest = of(row.id).map((r) => sorted(r).at(-1)).filter((l) => l && l.revenue !== null && l.revenue > 0 && l.netIncome !== null);
      const value = latest.reduce((a, l) => a + l!.netIncome!, 0) / latest.reduce((a, l) => a + l!.revenue!, 0);
      expect(row.value).toBeCloseTo(value, 12);
      expect(row.companies).toBe(latest.length);
    }
  });

  it("海外売上高比率: the top three equal the median of 日本以外 ÷ 合計 over companies with one domestic region", () => {
    for (const row of rankings.find((r) => r.id === "overseas-sales")!.rows.slice(0, 3)) {
      const ratios = of(row.id)
        .map((r) => r.regionalRevenue)
        .filter((g): g is NonNullable<Raw["regionalRevenue"]> => !!g && g.items.filter((i) => i.domestic).length === 1)
        .map((g) => ({ total: g.items.reduce((a, i) => a + i.amount, 0), overseas: g.items.filter((i) => !i.domestic).reduce((a, i) => a + i.amount, 0) }))
        .filter((x) => x.total > 0)
        .map((x) => x.overseas / x.total);
      expect(row.value).toBeCloseTo(median(ratios), 12);
      expect(row.companies).toBe(ratios.length);
    }
  });

  it("従業員数の伸び: the top three equal Σ最新期 ÷ Σ5期前 over companies with five complete years", () => {
    for (const row of rankings.find((r) => r.id === "employee-growth")!.rows.slice(0, 3)) {
      const complete = of(row.id).map((r) => sorted(r)).filter((f) => f.length >= 5 && f.slice(-5).every((y) => y.employees != null && y.employees > 0)).map((f) => f.slice(-5));
      const value = complete.reduce((a, f) => a + f[4]!.employees!, 0) / complete.reduce((a, f) => a + f[0]!.employees!, 0);
      expect(row.value).toBeCloseTo(value, 12);
      expect(row.companies).toBe(complete.length);
    }
  });

  it("売上高の伸び: the top industry equals the median of 最新期 ÷ 5期前 per company", () => {
    const row = rankings.find((r) => r.id === "revenue-growth")!.rows[0]!;
    const growth = of(row.id)
      .map((r) => sorted(r))
      .filter((f) => f.length >= 5)
      .map((f) => [f[0]!.revenue, f.at(-1)!.revenue] as const)
      .filter(([a, b]) => a !== null && b !== null && a > 0 && b > 0)
      .map(([a, b]) => b! / a!);
    expect(row.value).toBeCloseTo(median(growth), 12);
  });
});
