import { describe, expect, it } from "vitest";
import { checkProsePolicy, checkRelatedCompanies, errorsOf, findRelatedCandidates, nameVariants, normalizeCompanyName, proseFields, visibleText } from "../scripts/pipeline/prose-policy.mjs";

/**
 * The writing rules of 2026-10-17 as programs. Each case is a correction that used to need a person to read the
 * result and send the agent back; the point of testing them is that they stay the same for every company.
 */

const entry = (over: object = {}) => ({
  id: "acme",
  description: "鉄鋼を中心に多様な商品を売る商社です。",
  businessModel: { description: "鉄鋼を中心に金属や食品を仕入れて国内外の顧客に売り、鋼材の加工も手がける商社です。", flow: [], products: [], customers: [], revenueSources: [] },
  businesses: [],
  history: [],
  relatedCompanies: [],
  sources: [{ id: "yuho-2026", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100AAAA.pdf" }],
  financials: [],
  ...over,
});
const rules = (findings: { rule: string; severity: string }[], severity?: string) => findings.filter((f) => !severity || f.severity === severity).map((f) => f.rule);

describe("the one-sentence description", () => {
  it("accepts one short sentence", () => expect(errorsOf(checkProsePolicy(entry()))).toEqual([]));

  it("refuses two sentences — the long multi-sentence description is what was sent back", () => {
    const e = entry({ businessModel: { description: "住宅を請け負います。分譲も行います。" } });
    expect(rules(checkProsePolicy(e), "error")).toContain("one-sentence");
  });

  it("refuses a sentence over the length limit, counting the link label and not the link syntax", () => {
    const long = `${"あ".repeat(120)}です。`;
    expect(rules(checkProsePolicy(entry({ businessModel: { description: long } })), "error")).toContain("short-description");
    const linked = `[[term:segment|セグメント]]${"あ".repeat(80)}です。`;
    expect(rules(checkProsePolicy(entry({ businessModel: { description: linked } })), "error")).not.toContain("short-description");
    expect(visibleText("[[term:segment|セグメント]]の話")).toBe("セグメントの話");
  });
});

describe("the business is the subject, not the filing", () => {
  const withHistory = (text: string) => entry({ history: [{ year: 1900, title: "創業", description: text, sourceIds: ["yuho-2026"] }] });

  it.each(["有報は、いずれも現在の連結子会社としています。", "有価証券報告書によると、1862年に創業しました。", "有価証券報告書は2026年3月18日付の売却と記載しています。"])("is an error in the company's own prose: %s", (text) => {
    expect(rules(checkProsePolicy(withHistory(text)), "error")).toContain("filing-as-subject");
  });

  it("allows a declared gap and a time reference", () => {
    expect(rules(checkProsePolicy(withHistory("社名の由来は有報には書かれていません。有価証券報告書の提出時点で予定です。")), "error")).not.toContain("filing-as-subject");
  });

  it("is only a question for the reviewer inside a link's note", () => {
    const e = entry({ relatedCompanies: [{ companyId: "x", relationship: "supplier", description: "有報が仕入だけを書いているため、仕入先としています。", sourceIds: [] }] });
    const found = checkProsePolicy(e).filter((f) => f.rule === "filing-as-subject");
    expect(found.map((f) => f.severity)).toEqual(["review"]);
  });
});

describe("financial figures other than revenue and net income", () => {
  const model = (text: string) => entry({ businessModel: { description: "商社です。", flow: [{ kind: "profit", title: "当期純利益", description: text }] } });

  it.each(["営業利益は前期比5.0％減りました。", "経常利益が目標に届きませんでした。", "セグメント利益は増えました。", "売上総利益の大きさ", "持分法による投資損益が加わります。", "特別利益が減りました。"])("refuses a profit measure even without a number: %s", (text) => {
    expect(rules(checkProsePolicy(model(text)), "error")).toContain("forbidden-financial-term");
  });

  it("refuses an amount next to an amount-type term, but allows naming the concept", () => {
    expect(rules(checkProsePolicy(model("総資産は1,715,394百万円でした。")), "error")).toContain("forbidden-financial-amount");
    expect(rules(checkProsePolicy(model("受注高と売上高は別の数字です。")), "error")).not.toContain("forbidden-financial-amount");
    expect(rules(checkProsePolicy(model("受注高は5,000億円でした。")), "error")).toContain("forbidden-financial-amount");
  });

  it("allows revenue and net income in their filing forms", () => {
    const text = "収益は2兆7,573億円、親会社の所有者に帰属する当期純利益は1,036億円、親会社株主に帰属する当期純利益は増えました。";
    expect(errorsOf(checkProsePolicy(model(text)))).toEqual([]);
    expect(rules(checkProsePolicy(model(text)))).not.toContain("other-profit-wording");
  });

  it("asks a person about any other profit wording", () => {
    expect(rules(checkProsePolicy(model("卸売の利益は割戻金に左右されます。")), "review")).toContain("other-profit-wording");
  });

  it("covers the notes on the figures table but not the table itself", () => {
    const e = entry({ financials: [{ fiscalYear: "2026年3月期", profitLabel: "経常利益", totalAssetsLabel: "総資産額", note: "営業利益の定義を変更しました。" }] });
    const fields = proseFields(e).map((f) => f.path);
    expect(fields).toContain("financials[0].note");
    expect(fields.join()).not.toContain("profitLabel");
    expect(rules(checkProsePolicy(e), "error")).toContain("forbidden-financial-term");
  });

  it("refuses investment terms", () => {
    expect(rules(checkProsePolicy(model("ROEの改善を目指します。")), "error")).toContain("investment-term");
    expect(rules(checkProsePolicy(model("PERFECTな品質")), "error")).not.toContain("investment-term");
  });
});

describe("links need an identity AND a relationship", () => {
  const registry = new Map([
    ["steel-a", { id: "steel-a", code: "5444", name: "大和工業", officialName: "大和工業株式会社", tier: "published" }],
    ["gone-b", { id: "gone-b", code: "5017", name: "富士石油", officialName: "富士石油株式会社", tier: "figures-only" }],
    ["yodoko", { id: "yodoko", code: "5451", name: "ヨドコウ", officialName: "ヨドコウ（旧会社名：淀川製鋼所）", tier: "figures-only" }],
  ]);
  const ledger = new Map([
    ["5444", { listing: "上場", name: "大和工業株式会社" }],
    ["5451", { listing: "上場", name: "淀川製鋼所" }],
  ]);
  const link = (over: object = {}) => ({ companyId: "steel-a", relationship: "supplier", description: "形鋼を仕入れています（2026年3月31日現在）。", sourceIds: ["yuho-2026"], ...over });
  const check = (links: object[], evidenceText: string | null = "仕入先は大和工業㈱です") => checkRelatedCompanies(entry({ relatedCompanies: links }), { registry, ledger, evidenceText });

  it("accepts a listed company whose name is in the filing and whose note says what the relationship is", () => {
    expect(errorsOf(check([link()]))).toEqual([]);
  });

  it("refuses a company the repository does not have — no invented companies", () => {
    expect(rules(check([link({ companyId: "nobody" })]), "error")).toContain("unknown-company");
  });

  it("refuses a name the filing does not contain unless another primary source is cited", () => {
    expect(rules(check([link()], "全く別の会社の話"), "error")).toContain("name-not-in-filing");
    const e = entry({ sources: [{ id: "official", url: "https://www.example.co.jp/ir/release.pdf" }, { id: "yuho-2026", url: "https://disclosure2dl.edinet-fsa.go.jp/x.pdf" }], relatedCompanies: [link({ sourceIds: ["official"] })] });
    const found = checkRelatedCompanies(e, { registry, ledger, evidenceText: "全く別の会社の話" });
    expect(found.find((f) => f.rule === "name-not-in-filing")?.severity).toBe("review");
  });

  it("matches a former name the filing may still print", () => {
    expect(nameVariants("ヨドコウ（旧会社名：淀川製鋼所）")).toEqual(expect.arrayContaining(["ヨドコウ", "淀川製鋼所"]));
    expect(errorsOf(check([link({ companyId: "yodoko" })], "淀川製鋼所㈱から仕入れる"))).toEqual([]);
  });

  it("refuses a counterpart the EDINET code list does not show as listed (operator's decision of 2026-10-18)", () => {
    const f = check([link({ companyId: "gone-b" })], "富士石油株式会社");
    expect(f.find((x) => x.rule === "not-in-ledger")?.severity).toBe("error");
  });

  it("refuses a duplicate link and a note too thin to say anything", () => {
    expect(rules(check([link(), link()]), "error")).toContain("duplicate-link");
    expect(rules(check([link({ description: "取引先です。" })]), "error")).toContain("thin-relationship");
  });

  it("matches full-width and half-width names and drops the corporate form", () => {
    expect(normalizeCompanyName("株式会社ＡＤＥＫＡ")).toBe("ADEKA");
    expect(normalizeCompanyName("㈱ADEKA")).toBe("ADEKA");
  });
});

describe("candidates for links, found by program", () => {
  const entries = [
    { id: "toyota", code: "7203", name: "トヨタ自動車", officialName: "トヨタ自動車株式会社", tier: "published" },
    { id: "short", code: "1111", name: "ト", officialName: "ト株式会社", tier: "figures-only" },
    { id: "kyoei", code: "5440", name: "共英製鋼", officialName: "共英製鋼株式会社", tier: "figures-only" },
    { id: "self", code: "9999", name: "自社", officialName: "自社株式会社", tier: "published" },
  ];
  const ledger = new Map([["7203", { listing: "上場" }]]);

  it("lists only companies whose name is in the filing, never the company itself, with their listing status", () => {
    const found = findRelatedCandidates("主要な取引先はトヨタ自動車㈱と共英製鋼㈱です。自社は…", entries, { selfId: "self", ledger });
    expect(found.map((c) => c.id).sort()).toEqual(["kyoei", "toyota"]);
    expect(found.find((c) => c.id === "toyota")?.listing).toBe("上場");
    expect(found.find((c) => c.id === "kyoei")?.listing).toContain("ない");
  });

  it("says nothing when no registered company is named", () => {
    expect(findRelatedCandidates("取引先は海外の会社だけです。", entries, { selfId: "self" })).toEqual([]);
  });
});
