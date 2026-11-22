/**
 * The weekly digest, as a draft e-mail (JCE-086). It builds this week's mail from the published
 * /updates.json — the same buildUpdates output the /digest page renders (JCE-052, with JCE-071's
 * verified-figures summaries) — and the recipient list, and writes the draft to a file for a person to
 * review. It never sends anything.
 *
 *   node scripts/digest/send-weekly-digest.mjs [--updates <file-or-url>] [--recipients <csv>]
 *       [--today YYYY-MM-DD] [--out <dir>] [--site <url>]
 *
 * Defaults: updates from https://kigyo-hyakka.com/updates.json, recipients from
 * scripts/digest/recipients.csv (see recipients.example.csv), today in JST, drafts to
 * scripts/digest/drafts/<date>-digest-draft.md.
 *
 * Sending is deliberately not implemented here. The future send path is a person sending the reviewed
 * draft through the Gmail connector (see docs/digest-email-ops.md); when an automated sender is decided,
 * it goes in a separate step that reads the draft file, never in this script's generation path.
 *
 * The recipient CSV has header `email,name,source`, one address per line, `#` lines are comments. The
 * file with real addresses is git-ignored and must never be committed (see .gitignore). With no
 * recipients the script still writes the draft for review, prints 送信対象なし, and exits 0.
 *
 * Requires Node >= 22.18: the template lives in src/lib/digest-email.ts and is imported with Node's
 * built-in type stripping. That module has no runtime imports, so the import works in plain Node.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDigestEmail } from "../../src/lib/digest-email.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DEFAULT_UPDATES_URL = "https://kigyo-hyakka.com/updates.json";
const DEFAULT_SITE_URL = "https://kigyo-hyakka.com";

const fail = (message) => {
  console.error(`send-weekly-digest: ${message}`);
  process.exit(1);
};

const parseArgs = (argv) => {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) fail(`引数が読めません: ${arg}`);
    const key = arg.slice(2);
    if (!["updates", "recipients", "today", "out", "site"].includes(key)) fail(`知らない引数です: ${arg}`);
    const value = argv[++i];
    if (value === undefined || value.startsWith("--")) fail(`--${key} に値が必要です`);
    out[key] = value;
  }
  return out;
};

const todayJst = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());

const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** The recipient list: header `email,name,source`, one address per line, `#` lines are comments. */
export const parseRecipientsCsv = (text) => {
  const lines = text.split(/\r?\n/);
  const rows = [];
  let headerSeen = false;
  const bad = [];
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    if (!headerSeen) {
      if (line.split(",").map((c) => c.trim())[0] !== "email") bad.push(`${i + 1}行目: 先頭行は email,name,source であること`);
      headerSeen = true;
      return;
    }
    const [email = "", name = "", source = ""] = line.split(",").map((c) => c.trim());
    if (!isValidEmail(email)) bad.push(`${i + 1}行目: メールアドレスの形が正しくありません (${email || "（空）"})`);
    else rows.push({ email, name, source });
  });
  if (bad.length > 0) fail(`宛先リストの形式が正しくありません:\n${bad.join("\n")}`);
  // One address, one draft: the same person twice gets one mail, not two.
  return [...new Map(rows.map((r) => [r.email, r])).values()];
};

const loadUpdates = async (updatesArg) => {
  const raw = updatesArg.startsWith("http://") || updatesArg.startsWith("https://")
    ? await (await fetch(updatesArg)).text()
    : readFileSync(resolve(updatesArg), "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    fail(`開示データが JSON として読めません: ${updatesArg}`);
  }
  if (!data || !Array.isArray(data.events) || typeof data.names !== "object") {
    fail(`開示データの形が想定と違います（events と names が必要です）: ${updatesArg}`);
  }
  return data;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const today = args.today ?? todayJst();
  if (!isValidDate(today)) fail(`--today は YYYY-MM-DD で指定してください: ${today}`);
  const siteUrl = args.site ?? DEFAULT_SITE_URL;
  const updatesSource = args.updates ?? DEFAULT_UPDATES_URL;
  const recipientsPath = args.recipients ?? join(root, "scripts", "digest", "recipients.csv");
  const outDir = args.out ? resolve(args.out) : join(root, "scripts", "digest", "drafts");

  const updates = await loadUpdates(updatesSource);
  const recipients = existsSync(recipientsPath)
    ? parseRecipientsCsv(readFileSync(recipientsPath, "utf8"))
    : [];

  const email = buildDigestEmail(updates, today, siteUrl);

  mkdirSync(outDir, { recursive: true });
  const draftPath = join(outDir, `${today}-digest-draft.md`);
  const draft = [
    `# 決算定期便 下書き（${today}）`,
    "",
    `- 生成日時: ${new Date().toISOString()}`,
    `- 対象週: ${today} を含む週（月曜〜日曜）`,
    `- 開示データ: ${updatesSource}（asOf ${updates.asOf}、過去 ${updates.days}日分）`,
    `- 宛先: ${recipients.length}件${recipients.length > 0 ? `（${recipients.map((r) => r.email).join("、")}）` : "（なし）"}`,
    `- 件名: ${email.subject}`,
    "",
    "## 本文（テキスト）",
    "",
    "```",
    email.text,
    "```",
    "",
    "## 本文（HTML）",
    "",
    "```html",
    email.html,
    "```",
    "",
    "> このファイルは下書きです。送信はこのスクリプトでは行いません。送る前に本文を確認し、Gmail コネクタ経由で送ること（docs/digest-email-ops.md）。",
    "",
  ].join("\n");
  writeFileSync(draftPath, draft, "utf8");

  console.log(`下書きを書き出しました: ${draftPath}`);
  console.log(`件名: ${email.subject}`);
  if (recipients.length === 0) {
    console.log("送信対象なし（宛先リストが空です。送信は行いません）");
  } else {
    console.log(`送信対象: ${recipients.length}件（送信は行いません。下書きを確認してから送ってください）`);
  }
};

await main();
