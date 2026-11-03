/**
 * Batches without a person between them (operator order 2026-10-31, JCE-035): for each batch of prime-order.txt,
 * enqueue → run → wait out a usage limit and run again → approve-ready (AI proxy approval) → content:publish → next.
 *
 *   node --env-file=.env.local scripts/pipeline/autopilot-loop.mjs --from 3 [--to 27] [--batch-budget 130]
 *
 * Every step is the existing command, run as a child: the gates are the same as by hand. The loop stops — it does not
 * guess — when publishing fails, when a batch's spend reaches its cap with companies left, or when a run makes no
 * progress twice in a row. Companies held for a reason (a data error, a pack whose fiscal years disagree) stay held and
 * are listed; approve-ready only takes sheets the run left ready.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dir = join(root, "pipeline/autopilot");
const args = process.argv.slice(2);
const flag = (/** @type {string} */ name, /** @type {string} */ fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const BATCH = 50;
const from = Number(flag("from", "3"));
const order = readFileSync(join(dir, "prime-order.txt"), "utf8").split(/\r?\n/).filter(Boolean);
const to = Number(flag("to", String(Math.ceil(order.length / BATCH))));
const batchBudget = Number(flag("batch-budget", "130"));
// An AI-run approval is recorded as a proxy approval on the operator's behalf (JCE-025/026)
const env = { ...process.env, JCE_AGENT: "1" };

const sh = (/** @type {string} */ cmd, /** @type {string[]} */ a) => {
  const r = spawnSync(cmd, a, { cwd: root, env, encoding: "utf8", shell: process.platform === "win32" && cmd === "npm", maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
};
const autopilot = (/** @type {string[]} */ a) => sh(process.execPath, ["--env-file=.env.local", "scripts/pipeline/autopilot.mjs", ...a]);
const record = (/** @type {string} */ id) => {
  const p = join(dir, "runs", `${id}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
};
const log = (/** @type {string} */ m) => console.log(`[${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}] ${m}`);

/** "resets 7:50am (Asia/Tokyo)" → ms until then (tomorrow if already past), plus a minute's margin; an hour if unreadable. */
function waitFor(/** @type {string} */ hint, now = new Date()) {
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(hint ?? "");
  if (!m) return 60 * 60_000;
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  const jst = new Date(now.getTime() + 9 * 3600_000);
  const target = Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate(), h, Number(m[2] ?? 0)) - 9 * 3600_000;
  return (target > now.getTime() ? target : target + 24 * 3600_000) - now.getTime() + 60_000;
}

const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));
const tally = (/** @type {string[]} */ ids) => {
  /** @type {Record<string, number>} */
  const t = {};
  for (const id of ids) t[record(id)?.status ?? "queued"] = (t[record(id)?.status ?? "queued"] ?? 0) + 1;
  return t;
};

for (let n = from; n <= to; n++) {
  const name = `batch-${String(n).padStart(2, "0")}.txt`;
  const file = join(dir, name);
  if (!existsSync(file)) writeFileSync(file, `${order.slice((n - 1) * BATCH, n * BATCH).join("\n")}\n`);
  const ids = readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  if (ids.length === 0) break;
  autopilot(["enqueue", "--file", `pipeline/autopilot/${name}`]);
  log(`${name}: ${ids.length} 社`);

  // A run or approval just after midnight reads the day's EDINET index before it is final and holds the company
  // (Batch 4, 2026-11-03: 41 held). Those are retried once the nightly batch is done, not left held.
  for (let pass = 0; pass < 2; pass++) {
    let stalled = 0;
    for (;;) {
      const spent = ids.reduce((s, id) => s + (record(id)?.cost?.usd ?? 0), 0);
      const left = batchBudget - spent;
      if (left < 3) {
        log(`${name}: 上限 $${batchBudget} に達した（$${spent.toFixed(2)}）。停止`);
        process.exit(1);
      }
      const before = JSON.stringify(tally(ids));
      autopilot(["run", "--ids", ids.join(","), "--limit", String(ids.length), "--budget", "3", "--total-budget", String(Math.floor(left))]);
      const paused = ids.map(record).filter((r) => r?.status === "paused");
      log(`${name}: ${JSON.stringify(tally(ids))}`);
      if (paused.length > 0) {
        const ms = waitFor(paused[0].pause?.hint ?? "");
        log(`使用上限。${Math.round(ms / 60_000)} 分後に再開`);
        await sleep(ms);
        for (const r of paused) autopilot(["retry", r.id]);
        continue;
      }
      if (JSON.stringify(tally(ids)) === before && ++stalled >= 2) break;
      if (!ids.some((id) => ["queued", "running", "prechecked"].includes(record(id)?.status ?? "queued"))) break;
    }

    const approved = autopilot(["approve-ready", "--include-flagged"]);
    log(approved.out.split("\n").filter((l) => /社を登録|登録できません/.test(l)).join(" / ") || "登録なし");
    const notFinal = ids.filter((id) => record(id)?.status === "held" && /not-final/.test(String(record(id)?.holds?.at(-1)?.reason ?? "")));
    if (notFinal.length === 0) break;
    const jstHour = new Date(Date.now() + 9 * 3600_000).getUTCHours();
    const ms = jstHour < 8 ? waitFor("8:05am") : 0;
    log(`確定前の日次索引で保留 ${notFinal.length} 社。${Math.round(ms / 60_000)} 分後に再試行`);
    await sleep(ms);
    for (const id of notFinal) autopilot(["retry", id]);
  }
  const published = sh("npm", ["run", "content:publish"]);
  if (!published.ok) {
    log(`公開に失敗。停止:\n${published.out.slice(-1500)}`);
    process.exit(1);
  }
  log(`${name}: 公開 ${(/公開しました: (\w+)/.exec(published.out) ?? [])[1] ?? "（変更なし）"}。保留: ${ids.filter((id) => record(id)?.status === "held").join(", ") || "なし"}`);
}
