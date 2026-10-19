import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import {
  diffLedgers,
  formatLedger,
  ledgerProblems,
  parseCodeList,
  parseCsvLine,
  parseLedger,
  readCodeListFile,
  readFirstZipEntry,
  reconcile,
  renderSummary,
  toLedger,
} from "../scripts/pipeline/sync-listing.mjs";

/**
 * The code-list sync reads EDINET's list of filers and reports how it differs from the project. It must read the
 * file exactly, refuse one that has changed shape, and never mistake a difference for an instruction.
 */

const HEADER = "ＥＤＩＮＥＴコード,提出者種別,上場区分,連結の有無,資本金,決算日,提出者名,提出者名（英字）,提出者名（ヨミ）,所在地,提出者業種,証券コード,提出者法人番号";
const csvRow = (edinet: string, listing: string, name: string, industry: string, secCode: string, closing = "3月31日") =>
  `"${edinet}","内国法人・組合","${listing}","有","100","${closing}","${name}","EN","YOMI","東京都","${industry}","${secCode}","1"`;
const csv = (rows: string[], asOf = "2026年10月16日現在", count = rows.length) => [`ダウンロード実行日,${asOf},件数,${count}件`, HEADER, ...rows].join("\r\n");

describe("reading the file", () => {
  it("parses quoted fields that contain commas and doubled quotes", () => {
    expect(parseCsvLine('"E1","KANEKO SEEDS CO., LTD.","a ""quoted"" word",x')).toEqual(["E1", "KANEKO SEEDS CO., LTD.", 'a "quoted" word', "x"]);
  });

  it("reads the date, the declared count and the rows, by column name rather than by position", () => {
    const parsed = parseCodeList(csv([csvRow("E00004", "上場", "カネコ種苗株式会社", "水産・農林業", "13760")]));
    expect(parsed).toMatchObject({ asOf: "2026-10-16", declared: 1 });
    expect(parsed.rows[0]).toMatchObject({ edinetCode: "E00004", listing: "上場", name: "カネコ種苗株式会社", industry: "水産・農林業", secCode: "13760", closing: "3月31日" });
  });

  it("refuses a file whose columns have changed, and one that is not a code list at all", () => {
    expect(() => parseCodeList(csv([csvRow("E1", "上場", "甲", "化学", "10010")]).replace("提出者業種", "業種"))).toThrow(/列が変わった/);
    expect(() => parseCodeList("<html>error</html>")).toThrow();
  });

  it("reads the first file of a ZIP, stored or deflated, through the central directory", () => {
    const zip = (method: 0 | 8, name: string, content: Buffer) => {
      const data = method === 8 ? deflateRawSync(content) : content;
      const nameBytes = Buffer.from(name);
      const local = Buffer.alloc(30);
      local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(method, 8); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(content.length, 22); local.writeUInt16LE(nameBytes.length, 26);
      const central = Buffer.alloc(46);
      central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(method, 10); central.writeUInt32LE(data.length, 20); central.writeUInt32LE(content.length, 24); central.writeUInt16LE(nameBytes.length, 28); central.writeUInt32LE(0, 42);
      const end = Buffer.alloc(22);
      const centralAt = local.length + nameBytes.length + data.length;
      end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(1, 10); end.writeUInt32LE(central.length + nameBytes.length, 12); end.writeUInt32LE(centralAt, 16);
      return Buffer.concat([local, nameBytes, data, central, nameBytes, end]);
    };
    for (const method of [0, 8] as const) {
      const entry = readFirstZipEntry(zip(method, "EdinetcodeDlInfo.csv", Buffer.from("hello code list")));
      expect(entry.name).toBe("EdinetcodeDlInfo.csv");
      expect(entry.data.toString()).toBe("hello code list");
    }
    expect(() => readFirstZipEntry(Buffer.from("not a zip at all"))).toThrow(/ZIP/);
  });

  it("reads a plain file from disk as text when it is not a ZIP", async () => {
    const dir = await mkdtemp(join(tmpdir(), "codelist-"));
    try {
      await writeFile(join(dir, "list.csv"), "a,b\r\n1,2\r\n");
      expect(readCodeListFile(join(dir, "list.csv"))).toBe("a,b\r\n1,2\r\n");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("the ledger", () => {
  const rows = parseCodeList(
    csv([
      csvRow("E1", "上場", "甲", "化学", "10010"),
      csvRow("E2", "上場", "乙", "情報・通信業", "285A0"),
      csvRow("E3", "非上場", "丙（旧）", "化学", "30030"),
      csvRow("E4", "上場", "丙", "化学", "30030"),
      csvRow("E5", "上場", "コードなし", "化学", ""),
    ]),
  ).rows;

  it("has one row per 4-character code, keeps codes that end in a letter, and drops rows with no code", () => {
    const ledger = toLedger(rows);
    expect(ledger.map((r) => r.code)).toEqual(["1001", "285A", "3003"]);
  });

  it("prefers the listed filer when a code has two", () => {
    expect(toLedger(rows).find((r) => r.code === "3003")).toMatchObject({ edinetCode: "E4", listing: "上場", name: "丙" });
  });

  it("round-trips through its file format, carrying the list's own date", () => {
    const ledger = toLedger(rows);
    const text = formatLedger(ledger, "2026-10-16");
    expect(parseLedger(text)).toEqual({ asOf: "2026-10-16", rows: ledger });
    expect(formatLedger(ledger, "2026-10-16")).toBe(text); // the same list always gives the same file
  });

  it("says what changed between two ledgers", () => {
    const a = toLedger(rows);
    const b = [
      ...a.filter((r) => r.code !== "1001").map((r) => (r.code === "285A" ? { ...r, industry: "サービス業" } : r.code === "3003" ? { ...r, listing: "非上場", name: "丙ホールディングス" } : r)),
      { code: "999A", edinetCode: "E9", name: "新規", industry: "化学", listing: "上場", closing: "3月31日" },
    ];
    const d = diffLedgers(a, b);
    expect(d.added.map((r) => r.code)).toEqual(["999A"]);
    expect(d.removed.map((r) => r.code)).toEqual(["1001"]);
    expect(d.industry).toEqual([{ code: "285A", name: "乙", from: "情報・通信業", to: "サービス業" }]);
    expect(d.listing).toEqual([{ code: "3003", name: "丙ホールディングス", from: "上場", to: "非上場" }]);
    expect(d.name.map((n) => n.code)).toEqual(["3003"]);
  });
});

describe("what must stop a ledger from being written", () => {
  const listed = (n: number) => Array.from({ length: n }, (_, i) => ({ code: String(1000 + i), edinetCode: `E${i}`, name: `n${i}`, industry: "化学", listing: "上場", closing: "3月31日" }));
  const parsedFor = (n: number, over: object = {}) => ({ asOf: "2026-10-16", declared: n, rows: Array(n).fill({}), ...over }) as Parameters<typeof ledgerProblems>[0];

  it("accepts a plausible list", () => expect(ledgerProblems(parsedFor(3800), listed(3800), listed(3790))).toEqual([]));
  it("refuses a list with too few listed companies", () => expect(ledgerProblems(parsedFor(500), listed(500), null).join()).toContain("上場の会社が 500 社しかない"));
  it("refuses a list whose declared count does not match the rows read", () => expect(ledgerProblems(parsedFor(3800, { declared: 4000 }), listed(3800), null).join()).toContain("宣言する件数"));
  it("refuses a list without a date", () => expect(ledgerProblems(parsedFor(3800, { asOf: null }), listed(3800), null).join()).toContain("作成日"));
  it("refuses a swing of more than 5% since the last ledger unless told it is expected", () => {
    expect(ledgerProblems(parsedFor(3300), listed(3300), listed(3800)).join()).toContain("5% を超えて");
    expect(ledgerProblems(parsedFor(3300), listed(3300), listed(3800), true)).toEqual([]);
  });
});

describe("comparing the list with the project", () => {
  const ledger = [
    { code: "1001", edinetCode: "E1", name: "甲", industry: "化学", listing: "上場", closing: "" },
    { code: "1002", edinetCode: "E2", name: "乙", industry: "化学", listing: "上場", closing: "" },
    { code: "1003", edinetCode: "E3", name: "丙", industry: "銀行業", listing: "上場", closing: "" },
    { code: "1004", edinetCode: "E4", name: "丁", industry: "銀行業", listing: "上場", closing: "" },
    { code: "1005", edinetCode: "E5", name: "戊", industry: "銀行業", listing: "上場", closing: "" },
    { code: "1006", edinetCode: "E6", name: "己", industry: "銀行業", listing: "上場", closing: "" },
    { code: "2001", edinetCode: "E7", name: "庚（非上場）", industry: "化学", listing: "非上場", closing: "" },
  ];
  const entries = [
    { id: "ko", code: "1001", name: "甲", tier: "published" },
    { id: "otsu", code: "1002", name: "乙", tier: "figures-only" },
    { id: "gone-fig", code: "9999", name: "消えた図表のみ", tier: "figures-only" },
    { id: "gone-pub", code: "9998", name: "消えた公開済み", tier: "published" },
    { id: "unlisted", code: "2001", name: "庚", tier: "figures-only" },
  ];
  const known = { failed: new Set(["1003"]), parked: new Set(["1004"]), universe: new Set(["1005"]) };
  const result = reconcile(ledger, entries, known);

  it("lists registered companies the list does not show as listed — a page that people read first", () => {
    expect(result.registeredNotListed.map((e) => e.id)).toEqual(["gone-pub", "unlisted", "gone-fig"]);
    expect(result.registeredNotListed[0]).toMatchObject({ id: "gone-pub", tier: "published", ledger: "（コードが無い）" });
    expect(result.registeredNotListed.find((e) => e.id === "unlisted")?.ledger).toBe("非上場");
  });

  it("says why a listed company has no entry", () => {
    expect(Object.fromEntries(result.listedWithoutEntry.map((c) => [c.code, c.why]))).toEqual({ "1003": "intake-failed", "1004": "parked", "1005": "in-universe", "1006": "new-listing" });
  });

  it("counts listed companies per industry and tier, unlisted ones not at all", () => {
    expect(result.listedCount).toBe(6);
    expect(result.industry.find((i) => i.industry === "化学")).toMatchObject({ listed: 2, published: 1, "figures-only": 1, unregistered: 0 });
    expect(result.industry.find((i) => i.industry === "銀行業")).toMatchObject({ listed: 4, published: 0, unregistered: 4 });
  });

  it("renders a summary a person can act on, and nothing in it changes data", () => {
    const text = renderSummary({ asOf: "2026-10-16", result, changes: null, affected: [], problems: [] });
    expect(text).toContain("消えた公開済み");
    expect(text).toContain("新規上場の可能性");
    expect(text).toContain("| 銀行業 | 4 | 0 | 0 | 0 | 4 |");
  });
});
