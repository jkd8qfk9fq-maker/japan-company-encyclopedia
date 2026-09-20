/**
 * Builds an "evidence pack" for one company from its 有価証券報告書 XBRL, so a
 * research agent spends tokens on judgement instead of on finding and reading
 * PDFs.
 *
 *   node scripts/research/evidence-pack.mjs <company-id> <4-digit code> [--from 2026-06-01] [--to 2026-06-30]
 *
 * Writes to <RESEARCH_CACHE>/evidence/<company-id>/:
 *   summary.json          — filing metadata, five-year figures (in yen, tagged), restatement check
 *   indicators.txt        — 主要な経営指標等の推移 as printed, to confirm the tagged values
 *   history.txt           — 沿革
 *   business.txt          — 事業の内容
 *   affiliates.txt        — 関係会社の状況
 *   segments.txt          — セグメント情報 (report segments, and the revenue table)
 *   facilities.txt        — 主要な設備の状況
 *   sections.json         — every other TextBlock, by name, for anything else
 *
 * Both the current and the previous year's filing are read: the previous one
 * is how a restatement is detected, mechanically, instead of by eye.
 *
 * The figures are the filing's own tagged values in yen; nothing is converted
 * or rounded here. Labels come from the filing too (売上高 / 営業収益 / 収益 /
 * 経常収益 …) — the entry must use them verbatim.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir, downloadDocument, findAnnualReports, readCsvRows, textBlockToText } from "./edinet.mjs";

/**
 * Which tagged line is the top line, and which is net income — by element ID,
 * never by label. Labels vary per filer ("売上収益（IFRS）", "営業収益",
 * "当期利益又は当期損失（△）：親会社の所有者に帰属（IFRS）"), but the element is
 * fixed by the taxonomy.
 *
 * The lists are exact on purpose. Substring matching is dangerous here:
 * OrdinaryIncome is 経常収益 (a bank's top line) while OrdinaryIncomeLoss is
 * 経常利益 (a profit), and ProfitLossIFRS is 当期利益 *including*
 * non-controlling interests, which must never be presented as net income.
 * An unrecognised filer fails loudly below rather than producing an entry with
 * a silently missing or wrong row.
 */
const REVENUE_ELEMENTS = new Set([
  "NetSalesSummaryOfBusinessResults", // 売上高 (J-GAAP)
  "RevenueIFRSSummaryOfBusinessResults", // 売上収益 (IFRS)
  "RevenuesUSGAAPSummaryOfBusinessResults", // 売上高 (US GAAP)
  "OperatingRevenue1SummaryOfBusinessResults", // 営業収益
  "OperatingRevenueSummaryOfBusinessResults",
  "OrdinaryIncomeSummaryOfBusinessResults", // 経常収益 (銀行・保険)
  "NetSalesAndOperatingRevenueSummaryOfBusinessResults",
  "TotalOperatingRevenuesSummaryOfBusinessResults",
]);
const NET_INCOME_ELEMENTS = new Set([
  "ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults", // 親会社株主に帰属する当期純利益
  "ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults", // 親会社の所有者に帰属する当期利益
  "NetIncomeLossAttributableToOwnersOfParentUSGAAPSummaryOfBusinessResults",
  "NetIncomeLossSummaryOfBusinessResults",
]);

/**
 * A filer whose top line has no standard element tags it with its own extension
 * element instead, in the filer's namespace and with no label at all — Toyota's
 * 営業収益 is `…:OperatingRevenuesIFRSKeyFinancialData`, Sony's
 * 売上高及び金融ビジネス収入 is `…:SalesAndFinancialServicesRevenueIFRSKeyFinancialData`.
 * These are matched by shape, so every candidate is kept and the researcher
 * confirms which line the filing actually prints against indicators.txt.
 */
const REVENUE_EXTENSION = /^(?:Total)?(?:Net)?(?:Sales|Revenue|Revenues|OperatingRevenue|OperatingRevenues)[A-Za-z]*$/;
/** Never a top line: a profit, a margin, or a comprehensive-income row. */
const NOT_REVENUE = /(Profit|Income|Loss|Margin|Ratio|Comprehensive|PerShare|Cost|Expenses)/;
/** 相対年度 → offset from the filing's own fiscal year. */
const YEAR_OFFSET = { 当期: 0, 前期: 1, 前々期: 2, 三期前: 3, 四期前: 4 };

/**
 * Each file takes the first element present. A J-GAAP filer tags a section under
 * jpcrp_cor / jpdei_cor; an IFRS filer tags the financial-statement notes under
 * jpigp_cor instead, which is why the segment note needs both spellings — without
 * the IFRS one, the most important section of the pack is silently absent.
 */
const SECTIONS = {
  "indicators.txt": ["jpcrp_cor:BusinessResultsOfGroupTextBlock"],
  "history.txt": ["jpcrp_cor:CompanyHistoryTextBlock"],
  "business.txt": ["jpcrp_cor:DescriptionOfBusinessTextBlock"],
  "affiliates.txt": ["jpcrp_cor:OverviewOfAffiliatedEntitiesTextBlock"],
  "segments.txt": [
    "jpcrp_cor:NotesSegmentInformationEtcConsolidatedFinancialStatementsTextBlock",
    "jpigp_cor:NotesSegmentInformationConsolidatedFinancialStatementsIFRSTextBlock",
  ],
  "segment-overview.txt": ["jpcrp_cor:DescriptionOfReportableSegmentsTextBlock"],
  // Present only when the company changed its reportable segments — exactly the
  // case the protocol asks a researcher to reason about.
  "segment-changes.txt": [
    "jpigp_cor:DisclosureOfChangesInReportableSegmentsIFRSTextBlock",
    "jpcrp_cor:NotesChangesInReportableSegmentsEtcConsolidatedFinancialStatementsTextBlock",
  ],
  "facilities.txt": ["jpcrp_cor:MajorFacilitiesTextBlock"],
};

/**
 * The filing's cover page and DEI header: 商号, 英訳名, 証券コード, 会計基準,
 * 事業年度, 上場金融商品取引所名. Every one of these is a field an entry needs and
 * none of them is in the body sections, so without this a researcher goes looking
 * for a company web page — which is slower, is a weaker source, and has repeatedly
 * 403'd or 404'd, leaving `nameEn` unfilled when the filing had it all along.
 */
function coverPage(rows) {
  const out = {};
  for (const row of rows) {
    const id = row["要素ID"] ?? "";
    const name = row["項目名"] ?? "";
    const value = (row["値"] ?? "").trim();
    if (!value || value === "－" || value.length > 200) continue;
    if (!/CoverPage$|DEI$/.test(id) && !name.startsWith("上場金融商品取引所名")) continue;
    if (/TextBlock/.test(id)) continue;
    out[name || id] = value;
  }
  return out;
}

/** 相対年度, falling back to the context id (extension rows often leave it blank). */
function relativeYear(row) {
  const stated = row["相対年度"];
  if (stated && stated in YEAR_OFFSET) return stated;
  const context = row["コンテキストID"] ?? "";
  if (/^CurrentYear/.test(context)) return "当期";
  const prior = /^Prior(\d)Year/.exec(context);
  return prior ? { 1: "前期", 2: "前々期", 3: "三期前", 4: "四期前" }[prior[1]] : null;
}

/** Five-year figures from one filing: only consolidated rows, labels as filed. */
function fiveYearFigures(rows, periodEnd) {
  const summary = rows.filter(
    (r) =>
      // 主要な経営指標等の推移 is tagged either with the standard summary elements
      // or, for a line the taxonomy has no element for, a KeyFinancialData extension.
      /(SummaryOfBusinessResults|KeyFinancialData)$/.test(r["要素ID"]) &&
      // Non-consolidated rows carry the dimension in their context id.
      !/NonConsolidated/i.test(r["コンテキストID"] ?? "") &&
      r["単位"] === "円",
  );
  const pick = (elements, extension) => {
    const rowsFor = summary.filter((r) => {
      const local = r["要素ID"].replace(/^.*:/, "");
      if (elements.has(local)) return true;
      if (!extension || r["要素ID"].startsWith("jpcrp_cor:") || r["要素ID"].startsWith("jpigp_cor:")) return false;
      const stem = local.replace(/(IFRS|USGAAP|JPGAAP)?KeyFinancialData$/, "").replace(/SummaryOfBusinessResults$/, "");
      return extension.test(stem) && !NOT_REVENUE.test(stem);
    });
    const byElement = new Map();
    for (const r of rowsFor) {
      if (!byElement.has(r["要素ID"])) byElement.set(r["要素ID"], []);
      byElement.get(r["要素ID"]).push(r);
    }
    // A filer tags one element for the line it actually reports; if several
    // match, keep them all and let the researcher confirm against indicators.txt.
    return [...byElement.entries()]
      .map(([element, list]) => ({
        element,
        // Extension elements carry no label; the filing's own wording for them is
        // only in the printed table, so the researcher reads it from indicators.txt.
        label: (list[0]["項目名"] ?? "").replace(/、経営指標等$/, "") || null,
        years: list
          .map((r) => ({ row: r, relative: relativeYear(r) }))
          .filter(({ relative }) => relative)
          .map(({ row, relative }) => ({
            relative,
            fiscalYearEnd: shiftYear(periodEnd, YEAR_OFFSET[relative]),
            yen: Number(row["値"]),
          }))
          .sort((a, b) => a.fiscalYearEnd.localeCompare(b.fiscalYearEnd)),
      }))
      .filter((candidate) => candidate.years.length > 0);
  };
  const figures = { revenue: pick(REVENUE_ELEMENTS, REVENUE_EXTENSION), netIncome: pick(NET_INCOME_ELEMENTS, null) };
  // A filer whose top line or net-income element is not in the allowlist must be
  // added to it deliberately, after checking what the filing prints. Returning an
  // empty list here would hand a researcher a pack with a missing row and no sign
  // that anything was wrong.
  for (const [kind, list] of Object.entries(figures)) {
    if (list.length === 0) {
      const available = [...new Set(summary.map((r) => r["要素ID"].replace(/^.*:/, "")))].join(", ");
      throw new Error(
        `no ${kind} element matched. Check 主要な経営指標等の推移 and add the right element to ` +
          `${kind === "revenue" ? "REVENUE_ELEMENTS" : "NET_INCOME_ELEMENTS"}. Tagged here: ${available}`,
      );
    }
  }
  return figures;
}

/**
 * The same fiscal year end, `years` earlier.
 *
 * Naively subtracting from the day number is wrong for a February year end: a
 * 2月期 filer's 2026-02-28 is two years after 2024-02-**29**, because 2024 was a
 * leap year. That put a date on セブン＆アイ's page that never existed as a
 * fiscal year end. So when the base date is the last day of its month, the
 * result is the last day of that month in the target year; otherwise the day is
 * kept as-is (キーエンス closes on the 20th, not a month end).
 */
function shiftYear(isoDate, years) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = y - years;
  const lastDayOfMonth = (year) => new Date(Date.UTC(year, m, 0)).getUTCDate();
  const day = d === lastDayOfMonth(y) ? lastDayOfMonth(target) : d;
  return `${target}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * The fiscal year a filing reports on. EDINET leaves `periodEnd` null on a
 * 訂正有価証券報告書, but its title still names the period
 * ("訂正有価証券報告書－第157期(2025/04/01－2026/03/31)"), so read it from there
 * rather than dropping the filing.
 */
function resolvePeriodEnd(filing) {
  if (filing.periodEnd) return filing.periodEnd;
  const match = /－(\d{4})\/(\d{2})\/(\d{2})\)/.exec(filing.docDescription ?? "");
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

/**
 * The filing to build the pack from: the newest 有価証券報告書 (120) for the
 * newest fiscal year. A 訂正 (130) is never the base — it amends an original,
 * and is checked separately so an amendment is reported, not silently adopted.
 */
function pickBase(reports) {
  const dated = reports.map((r) => ({ ...r, resolvedPeriodEnd: resolvePeriodEnd(r) })).filter((r) => r.resolvedPeriodEnd);
  const originals = dated.filter((r) => r.docTypeCode === "120");
  const pool = originals.length > 0 ? originals : dated;
  return pool.sort(
    (a, b) => b.resolvedPeriodEnd.localeCompare(a.resolvedPeriodEnd) || b.submitDateTime.localeCompare(a.submitDateTime),
  )[0];
}

function compare(current, previous) {
  const flat = (figures) =>
    new Map(figures.flatMap((f) => f.years.map((y) => [`${f.label}|${y.fiscalYearEnd}`, y.yen])));
  const now = flat(current);
  const before = flat(previous);
  const differences = [];
  for (const [key, value] of before) {
    if (now.has(key) && now.get(key) !== value) {
      differences.push({ key, previousFiling: value, latestFiling: now.get(key) });
    }
  }
  return { comparedRows: [...before.keys()].filter((k) => now.has(k)).length, differences };
}

/** A filing's five-year figures, or null if EDINET has no CSV for it. */
async function figuresFor(filing) {
  const zip = await downloadDocument(filing.docID, 5);
  if (!zip) return null;
  const rows = readCsvRows(zip);
  return { rows, figures: fiveYearFigures(rows, filing.resolvedPeriodEnd ?? resolvePeriodEnd(filing)) };
}

/**
 * Everything a researcher needs before opening a section file, on one page.
 *
 * Without it each researcher reads summary.json — 14KB of JSON carrying a
 * section index and per-year context ids it never uses — just to recover the
 * cover-page fields and ten figures. This is the same data, ~1KB, already in
 * the units the entry stores.
 */
const BRIEF_COVER_FIELDS = [
  "会社名",
  "英訳名",
  "提出者名",
  "証券コード",
  "会計基準",
  "事業年度",
  "当事業年度終了日",
  "当会計期間終了日",
  "上場金融商品取引所名",
  "連結決算の有無",
];

function brief(companyId, code4, filing, cover, figures, previous, warnings, corrections, sections) {
  const yen = (n) => n.toLocaleString("ja-JP");
  const million = (n) => (n / 1_000_000).toLocaleString("ja-JP");
  const rows = [];
  for (const [kind, list] of [
    ["売上", figures.revenue],
    ["純利益", figures.netIncome],
  ]) {
    for (const candidate of list) {
      rows.push(`\n**${kind}** — XBRL label \`${candidate.label ?? "(無題・拡張要素)"}\` [\`${candidate.element}\`]`);
      rows.push("");
      rows.push("| 決算期 | 円 | 百万円 |");
      rows.push("|---|---:|---:|");
      for (const y of candidate.years) rows.push(`| ${y.fiscalYearEnd} | ${yen(y.yen)} | ${million(y.yen)} |`);
    }
  }
  const restatement = previous?.figures
    ? (() => {
        const d = [...compare(figures.revenue, previous.figures.revenue).differences, ...compare(figures.netIncome, previous.figures.netIncome).differences];
        return d.length === 0
          ? "前期有報と重複年度は全て一致（修正再表示なし）"
          : `**前期有報と差異あり — 理由を有報で特定し、ログに記録すること**\n\n\`\`\`json\n${JSON.stringify(d, null, 2)}\n\`\`\``;
      })()
    : "前期有報が窓内に見つからず、比較していない";

  return [
    `# ${companyId} — evidence brief`,
    "",
    "数値は有報のXBRLタグそのもの。**円の値をそのままコピーすること**（換算・四捨五入・手入力をしない）。",
    "ラベルは taxonomy ではなく `indicators.txt` の印字どおりに採ること。",
    "",
    "## 表紙・DEI",
    "",
    // Only the fields an entry actually uses. cover-page.txt keeps the rest
    // (提出先, 府令, 電話番号, 事務連絡者…), which no company page has ever needed.
    ...Object.entries(cover)
      .filter(([k]) => BRIEF_COVER_FIELDS.some((f) => k.startsWith(f)))
      .map(([k, v]) => `- **${k}**: ${v}`),
    "- （表紙のその他の項目は `cover-page.txt`）",
    "",
    `- **証券コード（検索に使用）**: ${code4}`,
    `- **有報**: ${filing.docDescription} / docID \`${filing.docID}\` / 提出 ${filing.submitDateTime} / 決算期 ${filing.resolvedPeriodEnd}`,
    "",
    "## 5年間の数値",
    ...rows,
    "",
    "## 修正再表示チェック",
    "",
    restatement,
    "",
    ...(warnings.length > 0 ? ["## 注意", "", ...warnings.map((w) => `- ${w}`), ""] : []),
    ...(corrections.length > 0
      ? ["## 訂正有価証券報告書", "", ...corrections.map((c) => `- ${c.docDescription} (docID \`${c.docID}\`, 提出 ${c.submitDateTime})${c.comparedToBase ? ` — 本体との差異: ${JSON.stringify(c.comparedToBase)}` : ""}`), ""]
      : []),
    "## 本文ファイル",
    "",
    ...Object.entries(sections).map(([file, s]) => `- \`${file}\` (${s.characters.toLocaleString("ja-JP")}字)`),
    "- `sections.json` — その他の全テキストブロック",
    "",
  ].join("\n");
}

async function packFor(companyId, code4, from, to) {
  const reports = await findAnnualReports(code4, from, to);
  if (reports.length === 0) throw new Error(`no 有価証券報告書 for ${code4} between ${from} and ${to}`);
  const latest = pickBase(reports);
  if (!latest) throw new Error(`no filing with a readable fiscal year for ${code4} between ${from} and ${to}`);
  const { rows } = await figuresFor(latest);
  const figures = fiveYearFigures(rows, latest.resolvedPeriodEnd);

  const warnings = [];
  // More than one tagged candidate means the filer tags a line the entry must not
  // confuse with the top line (売上総利益, 当期利益 including minorities…).
  for (const [kind, list] of Object.entries(figures)) {
    if (list.length > 1) {
      warnings.push(
        `${kind} の候補が ${list.length} 件ある（${list.map((c) => c.label ?? c.element).join(" / ")}）。` +
          `indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと`,
      );
    }
  }

  // 訂正有価証券報告書 amend a filing already submitted. One covering the base
  // year is compared against the base, so the amendment is reported rather than
  // discovered by eye; one covering an earlier year still has to be read.
  const corrections = [];
  for (const report of reports) {
    if (report.docTypeCode !== "130") continue;
    const periodEnd = resolvePeriodEnd(report);
    const record = { docID: report.docID, periodEnd, submitDateTime: report.submitDateTime, docDescription: report.docDescription };
    if (periodEnd === latest.resolvedPeriodEnd && report.submitDateTime > latest.submitDateTime) {
      const amended = await figuresFor({ ...report, resolvedPeriodEnd: periodEnd });
      record.comparedToBase = amended
        ? { revenue: compare(amended.figures.revenue, figures.revenue), netIncome: compare(amended.figures.netIncome, figures.netIncome) }
        : { note: "EDINET serves no CSV for this correction — read the PDF" };
      warnings.push(`${report.docDescription} が提出されている。差異は corrections[].comparedToBase を参照し、リサーチログに記録すること`);
    } else {
      warnings.push(`${report.docDescription} が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること`);
    }
    corrections.push(record);
  }

  // Previous year's filing, for the restatement check.
  const previousWindow = [shiftYear(from, 1), shiftYear(to, 1)];
  let previous = null;
  try {
    const older = await findAnnualReports(code4, previousWindow[0], previousWindow[1]);
    const olderBase = pickBase(older);
    if (olderBase) {
      const read = await figuresFor(olderBase);
      previous = read ? { filing: olderBase, figures: read.figures } : { error: "no CSV for the previous filing" };
      for (const report of older) {
        if (report.docTypeCode !== "130") continue;
        warnings.push(`前期の窓に ${report.docDescription} がある。過年度の修正再表示の可能性があるため内容を確認すること`);
      }
    }
  } catch (error) {
    previous = { error: String(error) };
  }

  const cover = coverPage(rows);
  const dir = join(cacheDir(), "evidence", companyId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "cover-page.txt"),
    Object.entries(cover)
      .map(([k, v]) => `${k}\t${v}`)
      .join("\n"),
    "utf8",
  );
  const sectionIndex = {};
  for (const [file, elements] of Object.entries(SECTIONS)) {
    const row = rows.find((r) => elements.includes(r["要素ID"]) && r["値"]);
    if (!row) continue;
    const text = textBlockToText(row["値"]);
    writeFileSync(join(dir, file), text, "utf8");
    sectionIndex[file] = { element: row["要素ID"], characters: text.length };
  }
  if (!sectionIndex["segments.txt"]) {
    warnings.push("セグメント情報のテキストブロックが見つからない。有報本文でセグメント情報を確認すること");
  }
  const taken = Object.values(SECTIONS).flat();
  const others = rows
    .filter((r) => /TextBlock/.test(r["要素ID"]) && !taken.includes(r["要素ID"]) && r["値"]?.length > 200)
    .map((r) => ({ name: r["項目名"], element: r["要素ID"], text: textBlockToText(r["値"]) }));
  writeFileSync(join(dir, "sections.json"), JSON.stringify(others, null, 2), "utf8");

  writeFileSync(join(dir, "brief.md"), brief(companyId, code4, latest, cover, figures, previous, warnings, corrections, sectionIndex), "utf8");

  const summary = {
    companyId,
    securitiesCode: code4,
    filing: latest,
    coverPage: cover,
    otherFilingsInWindow: reports.filter((r) => r.docID !== latest.docID),
    corrections,
    warnings,
    figures,
    previousFiling: previous?.filing ?? null,
    restatementCheck: previous?.figures
      ? {
          revenue: compare(figures.revenue, previous.figures.revenue),
          netIncome: compare(figures.netIncome, previous.figures.netIncome),
        }
      : { note: previous?.error ?? "previous filing not found in window" },
    sections: sectionIndex,
    otherSections: others.map((o) => o.name),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(dir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
  return { dir, summary };
}

const [companyId, code4, ...rest] = process.argv.slice(2);
if (!companyId || !code4) {
  console.error("usage: node scripts/research/evidence-pack.mjs <company-id> <4-digit code> [--from YYYY-MM-DD] [--to YYYY-MM-DD]");
  process.exit(1);
}
const options = Object.fromEntries(rest.map((a, i, all) => (a.startsWith("--") ? [a.slice(2), all[i + 1]] : [])).filter((e) => e.length));
const { dir, summary } = await packFor(companyId, code4, options.from ?? "2026-06-01", options.to ?? "2026-06-30");

console.log(`${companyId} (${code4}) → ${dir}`);
console.log(`filing: ${summary.filing.filerName} | ${summary.filing.docDescription} | 提出 ${summary.filing.submitDateTime} | 決算期 ${summary.filing.periodEnd} | docID ${summary.filing.docID}`);
if (summary.otherFilingsInWindow.length) {
  console.log(`other filings in window: ${summary.otherFilingsInWindow.map((f) => `${f.docTypeCode}:${f.docID}(${f.submitDateTime})`).join(", ")}`);
}
for (const kind of ["revenue", "netIncome"]) {
  for (const candidate of summary.figures[kind]) {
    console.log(`${kind}: ${candidate.label} [${candidate.element}]`);
    for (const y of candidate.years) console.log(`   ${y.fiscalYearEnd}  ${y.yen.toLocaleString("ja-JP")} 円  (${(y.yen / 1_000_000).toLocaleString("ja-JP")} 百万円)`);
  }
}
console.log(
  "cover page:",
  ["会社名、表紙", "英訳名、表紙", "会計基準、DEI"].map((k) => `${k}=${summary.coverPage[k] ?? "-"}`).join(" | "),
);
console.log("restatement check:", JSON.stringify(summary.restatementCheck));
for (const warning of summary.warnings) console.log(`WARNING: ${warning}`);
for (const correction of summary.corrections) {
  if (correction.comparedToBase) console.log(`correction ${correction.docID} vs base:`, JSON.stringify(correction.comparedToBase));
}
console.log("sections:", Object.entries(summary.sections).map(([f, s]) => `${f} (${s.characters})`).join(", "));
