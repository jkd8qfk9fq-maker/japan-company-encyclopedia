/**
 * Write the explanation ("仕組み") and the industry-to-industry ties ("つながり") of industry pages from the
 * published entries of their member companies — one model call per industry, no tools.
 *
 *   node scripts/industries/write-industries.mjs <industry-id> [...]   write these
 *   node scripts/industries/write-industries.mjs --missing              every industry with members and no explanation
 *   node scripts/industries/write-industries.mjs <id> --pack            print the pack only (no model call)
 *
 * Why no tools: the evidence is small and fixed (each member's sourced prose, already checked against its 有報), so
 * it goes in the prompt and the model answers with JSON. A tool loop would re-send the context on every turn.
 * The model never writes sources: it cites pack keys, and this script turns them into each member's own 有報 source,
 * so an industry can only cite a filing a member entry already cites. The result is checked with the same schema and
 * integrity rules as everything else (tests/validate-file.test.ts) before it is placed in src/data/industries,
 * registered in its index and given its initial revision. One repair call with the errors, then it is left out.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { jstToday } from "../research/edinet.mjs";
import { cleanEnv, classifyExecutorFailure, resetHint } from "../pipeline/ai-executor.mjs";

const root = process.cwd();
const args = process.argv.slice(2);
const packOnly = args.includes("--pack");
const today = jstToday();
const outDir = join(root, "pipeline/results");
mkdirSync(outDir, { recursive: true });

const labels = Object.fromEntries(
  [...readFileSync(join(root, "src/lib/industry-labels.ts"), "utf8").matchAll(/"?([a-z-]+)"?:\s*\{\s*name:\s*"([^"]+)",\s*nameEn:\s*"([^"]+)"/g)].map((m) => [m[1], { name: m[2], nameEn: m[3] }]),
);
const companies = readdirSync(join(root, "src/data/companies"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(root, "src/data/companies", f), "utf8")));
const published = companies.filter((c) => (c.status?.state ?? "published") === "published");
const byId = new Map(companies.map((c) => [c.id, c]));
const primaryOf = (/** @type {any} */ c) => c?.industries?.find((/** @type {any} */ i) => i.primary)?.industryId ?? null;
const researched = new Set(readdirSync(join(root, "src/data/industries")).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)));

/** The newest 有報 source of a member, under a key unique across members. */
function memberSource(/** @type {any} */ c) {
  const yuho = (c.sources ?? []).filter((/** @type {any} */ s) => /^yuho-/.test(s.id)).sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")))[0];
  return yuho ? { ...yuho, id: `${c.id}-${yuho.id}` } : null;
}

const cut = (/** @type {string} */ s, n = 110) => {
  const t = String(s ?? "").replace(/\[\[[a-z]+:[^|\]]+\|([^\]]+)\]\]/g, "$1").replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n)}…` : t;
};

function buildPack(/** @type {string} */ id) {
  const members = published.filter((c) => (c.industries ?? []).some((/** @type {any} */ i) => i.industryId === id));
  const sources = new Map();
  const lines = [];
  for (const c of members.sort((a, b) => Number(primaryOf(b) === id) - Number(primaryOf(a) === id))) {
    const src = memberSource(c);
    if (!src) continue;
    sources.set(src.id, src);
    const ties = (c.relatedCompanies ?? [])
      .filter((/** @type {any} */ r) => r.relationship === "supplier" || r.relationship === "customer")
      .map((/** @type {any} */ r) => {
        const o = byId.get(r.companyId);
        return `${r.relationship === "supplier" ? "仕入先" : "顧客"}=${o?.name ?? r.companyId}（${labels[primaryOf(o)]?.name ?? "未分類"}）`;
      });
    lines.push(
      [
        `■ ${c.id}｜${c.name}｜${primaryOf(c) === id ? "主たる業界" : "副次の業界"}`,
        `  一文: ${cut(c.description, 120)}`,
        `  事業: ${(c.businesses ?? []).slice(0, 4).map((/** @type {any} */ b) => `${b.name}（${cut(b.description, 60)}）`).join(" / ")}`,
        c.businessModel?.products?.length ? `  製品: ${c.businessModel.products.slice(0, 5).map((/** @type {string} */ p) => cut(p, 30)).join("、")}` : "",
        c.businessModel?.customers?.length ? `  顧客: ${c.businessModel.customers.slice(0, 5).map((/** @type {string} */ p) => cut(p, 50)).join("、")}` : "",
        ties.length ? `  取引: ${ties.slice(0, 8).join("、")}` : "",
        `  出典: ${src.id}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  const text = [
    `業界: ${id}（${labels[id]?.name}）。掲載企業 ${lines.length} 社。`,
    `業界 id の一覧（links に使う）: ${Object.entries(labels).filter(([k]) => k !== id).map(([k, v]) => `${k}=${v.name}`).join(" / ")}`,
    "",
    ...lines,
  ].join("\n");
  return { text, sources, memberIds: new Set(members.map((c) => c.id)) };
}

/** One tool-less call: the pack in, JSON out. */
function callModel(/** @type {string} */ prompt) {
  const argv = [
    "-p",
    "--model", "sonnet",
    "--output-format", "json",
    "--max-budget-usd", "1.5",
    "--no-session-persistence",
    "--strict-mcp-config",
    "--disable-slash-commands",
    "--tools", "",
    "--append-system-prompt-file", join(root, "docs/industry-brief.md"),
  ];
  return new Promise((resolve) => {
    const child = spawn("claude", argv, { cwd: root, env: cleanEnv(process.env), stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", () => {
      let parsed = null;
      try {
        parsed = JSON.parse(out);
      } catch {
        /* classified below */
      }
      const text = String(parsed?.result ?? out) + (err ? `\n${err}` : "");
      resolve({ ok: !!parsed && parsed.is_error !== true, text, cost: parsed?.total_cost_usd ?? 0, kind: classifyExecutorFailure(text), hint: resetHint(text) });
    });
    child.stdin.end(prompt);
  });
}

const jsonIn = (/** @type {string} */ text) => {
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  return a !== -1 && b > a ? JSON.parse(text.slice(a, b + 1)) : null;
};

/** The model's answer → a full industry entry, or the reasons it cannot be one. */
function assemble(/** @type {string} */ id, /** @type {any} */ answer, /** @type {ReturnType<typeof buildPack>} */ pack) {
  const problems = [];
  const used = new Set([...(answer.sourceIds ?? []), ...(answer.categories ?? []).flatMap((/** @type {any} */ c) => c.sourceIds ?? []), ...(answer.links ?? []).flatMap((/** @type {any} */ l) => l.sourceIds ?? [])]);
  for (const key of used) if (!pack.sources.has(key)) problems.push(`出典キー「${key}」はパックにありません`);
  for (const c of answer.categories ?? []) for (const m of c.companyIds ?? []) if (!pack.memberIds.has(m)) problems.push(`分類「${c.name}」の企業「${m}」はこの業界の掲載企業ではありません`);
  const entry = {
    id,
    name: labels[id].name,
    nameEn: labels[id].nameEn,
    description: answer.description,
    sourceIds: answer.sourceIds,
    structure: answer.structure,
    categories: (answer.categories ?? []).map((/** @type {any} */ c) => ({ id: c.id, name: c.name, ...(answer.structure === "chain" && c.role ? { role: c.role } : {}), description: c.description, companyIds: c.companyIds ?? [], sourceIds: c.sourceIds ?? [] })),
    ...((answer.links ?? []).length ? { links: answer.links.map((/** @type {any} */ l) => ({ industryId: l.industryId, direction: l.direction, description: l.description, sourceIds: l.sourceIds ?? [] })) } : {}),
    sources: [...used].filter((k) => pack.sources.has(k)).map((k) => pack.sources.get(k)),
    status: { state: "published" },
    updatedAt: today,
  };
  return { entry, problems };
}

function validate(/** @type {string} */ file) {
  const r = spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", "tests/validate-file.test.ts"], { cwd: root, encoding: "utf8", env: { ...process.env, CONTENT_FILE: file } });
  if (r.status === 0) return [];
  // A failure stays a failure even when its lines cannot be read (colour codes): an unread failure must not pass.
  const lines = `${r.stdout}${r.stderr}`.replace(/\u001b\[[0-9;]*m/g, "").split("\n").filter((l) => /^\s*\+\s+"/.test(l)).map((l) => l.replace(/^\s*\+\s+"|",?$/g, "")).slice(0, 20);
  return lines.length > 0 ? lines : ["検証に落ちた（理由を読み取れない。npm run content:validate-file で確認）"];
}

function register(/** @type {string} */ id, /** @type {any} */ entry, /** @type {number} */ cost) {
  writeFileSync(join(root, "src/data/industries", `${id}.json`), `${JSON.stringify(entry, null, 2)}\n`);
  const indexPath = join(root, "src/data/industries/index.ts");
  let index = readFileSync(indexPath, "utf8");
  const ident = id.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
  if (!index.includes(`./${id}.json"`)) {
    index = index.replace(/(import semiconductors from "\.\/semiconductors\.json";)/, `$1\nimport ${ident} from "./${id}.json";`);
    index = index.replace(/Object\.entries\(\{ ([^}]*) \}\)/, (_, list) => `Object.entries({ ${[...list.split(", "), id === ident ? id : `"${id}": ${ident}`].join(", ")} })`);
    writeFileSync(indexPath, index);
  }
  const names = entry.sources.map((/** @type {any} */ s) => s.publisher).join("、");
  writeFileSync(
    join(root, "src/data/revisions", `${today}-industry-${id}-initial.json`),
    `${JSON.stringify({ id: `${today}-industry-${id}-initial`, targetType: "industry", targetId: id, changedAt: today, reason: "初版。掲載企業の解説（各社の有価証券報告書に基づく）だけを根拠に、AIが業界の仕組みとつながりを作成した（scripts/industries/write-industries.mjs）", summary: `${names} の有価証券報告書に基づきAIが作成` }, null, 2)}\n`,
  );
  mkdirSync(join(root, "docs/research"), { recursive: true });
  writeFileSync(
    join(root, "docs/research", `industry-${id}.md`),
    [
      `# 業界: ${entry.name}（${id}）— リサーチログ`,
      "",
      `- 作成: ${today}、scripts/industries/write-industries.mjs（モデル呼び出し1〜2回、概算 $${cost.toFixed(2)}）`,
      "- 根拠: 業界パック（この業界を自社の業界に含める掲載企業の、公開中の解説。各社の解説は有価証券報告書に基づく）だけ。一般知識・web は使っていない",
      "- 出典は掲載企業の有価証券報告書。業界の文の `sourceIds` は、その文の根拠になった企業の有報",
      "",
      "## 出典",
      ...entry.sources.map((/** @type {any} */ s) => `- ${s.id}: ${s.publisher}「${s.title}」 ${s.url}`),
      "",
    ].join("\n"),
  );
}

async function writeOne(/** @type {string} */ id) {
  if (!labels[id]) return console.log(`  ${id}: 業界 id ではありません`);
  const pack = buildPack(id);
  if (packOnly) return console.log(pack.text);
  if (pack.sources.size === 0) return console.log(`  ${id}: 掲載企業がない（書かない）`);
  const staged = join(outDir, `industry-${id}.json`);
  let prompt = pack.text;
  let cost = 0;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await callModel(prompt);
    cost += res.cost;
    if (!res.ok) {
      if (res.kind === "rate-limit") return console.log(`  ${id}: 利用上限（${res.hint ?? "解除時刻不明"}）。止めます`), "paused";
      return console.log(`  ${id}: モデルの失敗（${res.kind}）: ${res.text.slice(0, 200)}`);
    }
    let answer;
    try {
      answer = jsonIn(res.text);
    } catch {
      answer = null;
    }
    const { entry, problems } = answer ? assemble(id, answer, pack) : { entry: null, problems: ["JSON として読めない"] };
    if (entry) writeFileSync(staged, `${JSON.stringify(entry, null, 2)}\n`);
    const errors = [...problems, ...(entry && problems.length === 0 ? validate(staged) : [])];
    if (errors.length === 0) {
      register(id, entry, cost);
      return console.log(`  ${id}: 登録（分類 ${entry.categories.length}・つながり ${entry.links?.length ?? 0}・出典 ${entry.sources.length}社）$${cost.toFixed(2)}`);
    }
    if (attempt === 2) return console.log(`  ${id}: 不備が残った（$${cost.toFixed(2)}）: ${errors.slice(0, 4).join(" / ")}`);
    prompt = `${pack.text}\n\n---\n前回の回答に次の不備がありました。直した JSON 全体を返してください。\n${errors.map((e) => `- ${e}`).join("\n")}\n\n前回の回答:\n${JSON.stringify(answer)}`;
  }
}

const ids = args.includes("--missing") ? Object.keys(labels).filter((id) => !researched.has(id)) : args.filter((a) => !a.startsWith("--"));
if (ids.length === 0) {
  console.error("usage: node scripts/industries/write-industries.mjs <industry-id> … | --missing [--pack]");
  process.exit(1);
}
for (const id of ids) {
  if (!packOnly && researched.has(id)) {
    console.log(`  ${id}: 解説がすでにある（書き直さない）`);
    continue;
  }
  if ((await writeOne(id)) === "paused") break;
}
