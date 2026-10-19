/**
 * The writing rules of 2026-10-17 as checks a program can run — no model tokens.
 *
 * Until now these rules lived in a brief and were enforced by a person reading the result and sending the
 * agent back (two full rewrite passes on the first wave). Every rule below is one of those corrections.
 * Running them straight after the agent finishes, and giving the agent only the violated lines to repair,
 * is cheaper than a person-driven second pass, and it is the same on every company.
 *
 * Severity:
 *   error   the entry must not be registered as it is (the agent repairs it, or the company is held)
 *   review  a person should look at it before confirming; shown on the review sheet
 *   info    context for the reviewer
 *
 * Everything here is pure: the entry (or the fragments' data merged into one), a registry of the already
 * registered companies, the EDINET code-list ledger and the filing's own text go in; findings come out.
 */

/** Words that must not appear in prose: financial figures other than 売上高(収益) and 当期純利益, and investment terms. */
export const FORBIDDEN_PROFIT_TERMS = [
  "営業利益",
  "営業損益",
  "経常利益",
  "売上総利益",
  "粗利益",
  "セグメント利益",
  "セグメント損益",
  "持分法による投資損益",
  "持分法投資損益",
  "税引前",
  "特別利益",
  "特別損失",
];
/** Amount-type terms: naming the concept is fine (「受注高と売上高は別」); an amount next to it is not. */
export const AMOUNT_TERMS = ["総資産", "純資産", "計上額", "帳簿価額", "取得価額", "取得原価", "受注高", "繰越工事高", "研究開発費", "資本金", "販売費及び一般管理費", "営業活動によるキャッシュ"];
export const FORBIDDEN_FINANCIAL_TERMS = [...FORBIDDEN_PROFIT_TERMS, ...AMOUNT_TERMS];
/** A figure: digits or a Japanese number word with a unit, within this many characters of the term. */
const AMOUNT_NEAR = /[0-9０-９][0-9０-９,，.．]*\s*(?:円|百万|千|億|兆|万円)|[0-9０-９][0-9０-９,，.．]*\s*[%％]|(?:約|およそ)?[0-9０-９][0-9０-９,，.．]*(?:百万円|億円|兆円)/;

/** Investment terms (also enforced by integrity.ts on the whole entry; repeated so the agent is told early). */
export const INVESTMENT_TERMS = ["株価", "PER", "PBR", "ROE", "ROA", "EPS", "配当利回り", "目標株価", "買い推奨", "売り推奨", "時価総額", "配当性向", "1株当たり"];

/** Net income in any of the forms the filings use; every other 利益 in prose is a question for the reviewer. */
const NET_INCOME_FORMS = /親会社(?:株主|の所有者)に帰属する当期(?:純)?(?:利益|損益|損失)|当期純(?:利益|損益|損失)|当期(?:利益|損失)|純(?:利益|損益|損失)|親会社株主に帰属する|所有者に帰属する/g;

/** The filing as the subject of a sentence: 「有報は…と書いています」. The business is the subject; the source is a citation. */
const FILING_AS_SUBJECT = /(?:有価証券報告書|有報)(?:は|が|では|によれば|によると|の記載では)/;

/** Keys whose string values are identifiers or machine values, not prose. */
const NON_PROSE_KEYS = new Set(["id", "companyId", "industryId", "sourceIds", "relationship", "kind", "exchange", "market", "type", "state", "url", "publishedAt", "accessedAt", "year", "fiscalYear", "periodEnd", "term", "termId"]);
/** Top-level keys that hold no prose (or whose prose is checked elsewhere). */
const NON_PROSE_TOP = new Set(["id", "code", "officialName", "nameEn", "shortNameEn", "name", "listings", "industries", "sources", "status", "updatedAt", "financials", "registeredAt"]);

/** Visible text of a rich-text string: [[kind:id|label]] → label. */
export const visibleText = (/** @type {string} */ s) => s.replace(/\[\[[a-z]+:[^|\]]+\|([^\]]+)\]\]/g, "$1");

/**
 * Every prose string of an entry (or of fragments merged into one), with where it is.
 * `financials[].note` is prose; the rest of `financials` is mechanical and is verified elsewhere.
 * @param {any} entry
 * @returns {{ path: string, text: string }[]}
 */
export function proseFields(entry) {
  /** @type {{ path: string, text: string }[]} */
  const out = [];
  const walk = (/** @type {any} */ node, /** @type {string} */ path) => {
    if (typeof node === "string") {
      if (node.trim() !== "") out.push({ path, text: node });
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${path}[${i}]`));
    } else if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) if (!NON_PROSE_KEYS.has(k)) walk(v, path ? `${path}.${k}` : k);
    }
  };
  for (const [k, v] of Object.entries(entry ?? {})) {
    if (k === "financials") {
      (Array.isArray(v) ? v : []).forEach((row, i) => typeof row?.note === "string" && out.push({ path: `financials[${i}].note`, text: row.note }));
      continue;
    }
    if (NON_PROSE_TOP.has(k)) continue;
    walk(v, k);
  }
  return out;
}

/**
 * @typedef {{ severity: "error" | "review" | "info", rule: string, path: string, message: string, excerpt?: string }} Finding
 */

const excerptAround = (/** @type {string} */ text, /** @type {number} */ at, /** @type {number} */ len) => {
  const from = Math.max(0, at - 18);
  return text.slice(from, Math.min(text.length, at + len + 18)).replace(/\s+/g, " ");
};

/**
 * Rules about how the prose is written.
 * @param {any} entry
 * @returns {Finding[]}
 */
export function checkProsePolicy(entry) {
  /** @type {Finding[]} */
  const findings = [];

  // P1 — the one-sentence descriptions: short, exactly one sentence.
  const sentences = [
    ["description", entry?.description, 90],
    ["businessModel.description", entry?.businessModel?.description, 100],
  ];
  for (const [path, value, max] of /** @type {[string, unknown, number][]} */ (sentences)) {
    if (typeof value !== "string" || value.trim() === "") continue;
    const text = visibleText(value);
    const periods = (text.match(/。/g) ?? []).length;
    if (periods !== 1 || !text.trim().endsWith("。")) findings.push({ severity: "error", rule: "one-sentence", path, message: `一文の説明は句点（。）が1つで、文末にだけ置く（現在 ${periods} 個）`, excerpt: text.slice(0, 60) });
    if ([...text].length > max) findings.push({ severity: "error", rule: "short-description", path, message: `一文の説明は${max}文字以内（現在 ${[...text].length} 文字）`, excerpt: text.slice(0, 60) });
  }

  for (const { path, text } of proseFields(entry)) {
    // P2 — the business is the subject, not the filing.
    const subject = FILING_AS_SUBJECT.exec(text);
    // The company's own description, its business model, segments and history are about the business. A link's
    // note may say what the filing prints about the pair, so there it is a question for the reviewer.
    const aboutBusiness = /^(description|businessModel|businesses|history)/.test(path);
    if (subject) findings.push({ severity: aboutBusiness ? "error" : "review", rule: "filing-as-subject", path, message: "有報を主語にしない（事業や出来事を直接述べ、根拠は出典欄に任せる）", excerpt: excerptAround(text, subject.index, subject[0].length) });

    // P3 — financial figures other than revenue and net income.
    for (const term of FORBIDDEN_PROFIT_TERMS) {
      const at = text.indexOf(term);
      if (at !== -1) findings.push({ severity: "error", rule: "forbidden-financial-term", path, message: `本文の財務数値は売上高と当期純利益だけ（「${term}」は書かない）`, excerpt: excerptAround(text, at, term.length) });
    }
    for (const term of AMOUNT_TERMS) {
      for (let at = text.indexOf(term); at !== -1; at = text.indexOf(term, at + term.length)) {
        const around = text.slice(Math.max(0, at - 40), at + term.length + 40);
        if (AMOUNT_NEAR.test(around)) {
          findings.push({ severity: "error", rule: "forbidden-financial-amount", path, message: `本文の財務数値は売上高と当期純利益だけ（「${term}」の金額は書かない）`, excerpt: excerptAround(text, at, term.length) });
          break;
        }
      }
    }
    // Any other 利益/損益 is a question: net income forms are removed first.
    const rest = text.replace(NET_INCOME_FORMS, "");
    const profit = /(?:利益|損益|増益|減益)/.exec(rest);
    if (profit && !FORBIDDEN_PROFIT_TERMS.some((t) => text.includes(t))) {
      findings.push({ severity: "review", rule: "other-profit-wording", path, message: "売上高と当期純利益以外の利益に触れていないか確認する", excerpt: excerptAround(rest, profit.index, profit[0].length) });
    }

    // Investment terms.
    for (const term of INVESTMENT_TERMS) {
      const hit = /^[A-Za-z]+$/.test(term) ? new RegExp(`(^|[^A-Za-z])${term}([^A-Za-z]|$)`).exec(text) : text.indexOf(term) !== -1 ? { index: text.indexOf(term) } : null;
      if (hit) findings.push({ severity: "error", rule: "investment-term", path, message: `投資指標にあたる語「${term}」は書かない`, excerpt: excerptAround(text, hit.index, term.length) });
    }
  }
  return findings;
}

/** A company name as it is compared: NFKC, no spaces, no corporate form. */
export const normalizeCompanyName = (/** @type {string | null | undefined} */ name) =>
  (name ?? "").normalize("NFKC").replace(/\s+/g, "").replace(/株式会社|有限会社|合同会社|㈱|\(株\)|（株）/g, "");

/**
 * The names a company can appear under in a filing. EDINET prints a former name in the 商号:
 * 「ヨドコウ（旧会社名：淀川製鋼所）」 — a filing that speaks of the company before the change says
 * 淀川製鋼所, after it ヨドコウ. Both are the same company; each is tried.
 * @param {string | null | undefined} name
 * @returns {string[]}
 */
export function nameVariants(name) {
  const full = (name ?? "").normalize("NFKC");
  const base = normalizeCompanyName(full.replace(/\([^)]*\)/g, ""));
  const inside = [...full.matchAll(/\(([^)]*)\)/g)].map((m) => normalizeCompanyName(m[1].replace(/^(?:旧会社名|旧社名|旧商号|旧)[:：]?/, "")));
  return [...new Set([base, ...inside, normalizeCompanyName(full)].filter((n) => n.length >= 2))];
}

const TRADE_WORDS =/仕入|販売|供給|提携|共同|契約|出資|業務|協業|受注|納入|開発|取引|請負|調達|子会社|関連会社|持分/;

/**
 * Rules about the links to other companies. A link needs BOTH an identity (this is that listed company) and a
 * relationship (the source says something about this pair) — a name that merely matches is neither.
 * @param {any} entry
 * @param {{
 *   registry: Map<string, { id: string, code: string, name: string, officialName: string, tier: string }>,
 *   ledger: Map<string, { listing: string, name: string }>,
 *   evidenceText?: string | null,
 * }} context
 * @returns {Finding[]}
 */
export function checkRelatedCompanies(entry, { registry, ledger, evidenceText = null }) {
  /** @type {Finding[]} */
  const findings = [];
  const sources = new Map((entry?.sources ?? []).map((/** @type {any} */ s) => [s.id, s]));
  const evidence = evidenceText == null ? null : normalizeCompanyName(evidenceText).replace(/[,、]/g, "");
  const seen = new Set();
  (entry?.relatedCompanies ?? []).forEach((/** @type {any} */ link, /** @type {number} */ i) => {
    const path = `relatedCompanies[${i}]`;
    const target = registry.get(link.companyId);
    if (!target) return void findings.push({ severity: "error", rule: "unknown-company", path, message: `掲載済みエントリーに ${link.companyId} がありません（架空の企業を作らない）` });
    if (link.companyId === entry.id) findings.push({ severity: "error", rule: "self-link", path, message: "自社へのリンク" });
    if (seen.has(link.companyId)) findings.push({ severity: "error", rule: "duplicate-link", path, message: `${link.companyId} を二重に結んでいる` });
    seen.add(link.companyId);

    // Identity: listed per the EDINET code list.
    const listed = ledger.get(target.code);
    if (!listed) findings.push({ severity: "error", rule: "not-in-ledger", path, message: `${target.name}（${target.code}）が EDINET コードリストにない（上場廃止の可能性）。上場を確認できない相手は結ばない（有報の記載は warnings に残す）`, excerpt: target.officialName });
    else if (listed.listing !== "上場") findings.push({ severity: "error", rule: "not-listed", path, message: `${target.name}（${target.code}）の上場区分が「${listed.listing}」。上場でない相手は結ばない（有報の記載は warnings に残す）`, excerpt: target.officialName });
    if (target.tier === "figures-only") findings.push({ severity: "info", rule: "counterpart-figures-only", path, message: `${target.name} は数値のみ（リンク先に事業の説明がない）` });

    // Identity: the name must be in the filing the link rests on — or the link must cite another primary source.
    const names = [...new Set([...nameVariants(target.officialName), ...nameVariants(target.name)])];
    const citesOther = (link.sourceIds ?? []).some((/** @type {string} */ id) => {
      const s = sources.get(id);
      return s && !/(^|\.)edinet-fsa\.go\.jp$/.test(String(s.url).replace(/^https:\/\//, "").split("/")[0]);
    });
    if (evidence !== null && !names.some((n) => evidence.includes(n.replace(/[,、]/g, "")))) {
      findings.push(
        citesOther
          ? { severity: "review", rule: "name-not-in-filing", path, message: `${target.name} の名前が有報の本文に見当たらない。公式資料の出典に依拠している（人が出典を確認する）` }
          : { severity: "error", rule: "name-not-in-filing", path, message: `${target.name} の名前が有報の本文に見当たらず、他の出典もない。社名の一致だけで結ばない` },
      );
    }

    // Relationship: the description must say something about this pair.
    const description = String(link.description ?? "");
    if ([...description].length < 15) findings.push({ severity: "error", rule: "thin-relationship", path, message: "関係の説明が短すぎる（取引・提携・資本関係の事実を書く）" });
    else if (link.relationship === "business-partner" && !TRADE_WORDS.test(description)) findings.push({ severity: "review", rule: "relationship-unclear", path, message: "business-partner だが、説明に取引・提携の事実が見当たらない", excerpt: description.slice(0, 60) });
  });
  return findings;
}

/**
 * Registered companies whose name appears in the filing — the only candidates a link can rest on.
 * Mechanical, so the agent does not read a list of thousands to find them, and cannot link a name the filing
 * does not contain. Names of two characters or fewer are marked ambiguous (a common word can match).
 * @param {string} evidenceText
 * @param {{ id: string, code: string, name: string, officialName: string, tier: string }[]} entries
 * @param {{ selfId?: string, ledger?: Map<string, { listing: string }> }} [options]
 */
export function findRelatedCandidates(evidenceText, entries, { selfId = "", ledger = new Map() } = {}) {
  const text = evidenceText.normalize("NFKC").replace(/\s+/g, "").replace(/株式会社|有限会社|合同会社|㈱|\(株\)/g, "");
  const found = [];
  for (const e of entries) {
    if (e.id === selfId) continue;
    const names = [...new Set([...nameVariants(e.officialName), ...nameVariants(e.name)])];
    let best = null;
    for (const n of names) {
      const first = text.indexOf(n);
      if (first === -1) continue;
      if (!best || n.length > best.matched.length) best = { matched: n, first };
    }
    if (!best) continue;
    let count = 0;
    for (let at = text.indexOf(best.matched); at !== -1; at = text.indexOf(best.matched, at + best.matched.length)) count++;
    found.push({
      id: e.id,
      code: e.code,
      name: e.name,
      officialName: e.officialName,
      tier: e.tier,
      listing: ledger.get(e.code)?.listing ?? "（コードリストにない）",
      matched: best.matched,
      occurrences: count,
      ambiguous: best.matched.length <= 2,
      context: text.slice(Math.max(0, best.first - 24), best.first + best.matched.length + 24),
    });
  }
  // A longer name that contains a shorter matched name explains it (トヨタ自動車 ⊃ トヨタ): keep the longer.
  return found.filter((a) => !found.some((b) => b !== a && b.matched.length > a.matched.length && b.matched.includes(a.matched)));
}

/** @param {Finding[]} findings */
export const errorsOf = (findings) => findings.filter((f) => f.severity === "error");
