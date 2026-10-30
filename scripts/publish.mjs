/**
 * Publish in one command: one check, then launch.
 *
 *   npm run content:publish                 bring in GitHub's new commits → check once → copy to the clone → commit → push
 *   npm run content:publish -- --dry-run    say what would happen; write and push nothing
 *
 * This working tree is where content is made; the clean clone (JCE_PUBLISH_CLONE, default C:/jce-rewrite/repo — its
 * history carries no personal data) is what is pushed. Cloudflare builds and deploys main; a build that fails there
 * leaves the previous site up, so no local static build is run here (speed, 2026-10-30).
 *
 * 1. The clone is brought to GitHub's main (fast-forward only; it holds no work of its own).
 * 2. Files other sessions changed on GitHub since the last publish are copied into this tree, unless this tree changed
 *    the same file too — then it stops and names them (nothing is overwritten that someone else wrote).
 * 3. The one check: the type check and the whole test suite, here.
 * 4. Changed files are copied to the clone (never deleted; machine-local and other tools' files excluded), committed
 *    under the clone's own identity, and pushed to main. The commit it pushed is recorded for step 2 next time.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const clone = process.env.JCE_PUBLISH_CLONE ?? "C:/jce-rewrite/repo";
const dryRun = process.argv.includes("--dry-run");
const statePath = join(root, "pipeline/autopilot/publish-state.json");
/** Never published: machine-local analysis (paths on this PC), other tools' settings, secrets, and two components the
 * company-page redesign deleted upstream that this tree still has. */
const EXCLUDE = [/^pipeline\/analysis\//, /^\.agents\//, /^\.codex\//, /^\.env/, /^\.data\//, /^src\/components\/company\/(financial-chart|section-navigation)\.tsx$/];

const git = (/** @type {string[]} */ args, opts = {}) => execFileSync("git", ["-c", "core.quotepath=off", ...args], { cwd: clone, encoding: "utf8", maxBuffer: 1 << 28, ...opts }).trim();
const sha = (/** @type {Buffer | string} */ b) => createHash("sha1").update(b).digest("hex");
const step = (/** @type {string} */ s) => console.log(`\n▶ ${s}`);
const stop = (/** @type {string} */ s) => {
  console.error(`\n✖ ${s}`);
  process.exit(1);
};
const listed = (/** @type {string} */ dir) => new Set(execFileSync("git", ["-c", "core.quotepath=off", "ls-files", "-co", "--exclude-standard"], { cwd: dir, encoding: "utf8", maxBuffer: 1 << 28 }).split("\n").filter(Boolean));
const excluded = (/** @type {string} */ f) => EXCLUDE.some((re) => re.test(f));

// ------------------------------------------------------------------ 1. the clone at GitHub's main
step("公開用クローンを GitHub の main に合わせる");
if (!existsSync(join(clone, ".git"))) stop(`${clone} は git のクローンではありません（JCE_PUBLISH_CLONE）`);
if (git(["status", "--porcelain"])) stop(`${clone} に未コミットの変更があります。手で片付けてから`);
if (git(["branch", "--show-current"]) !== "main") git(["switch", "-q", "main"]);
const before = git(["rev-parse", "HEAD"]);
git(["fetch", "-q", "origin"]);
try {
  git(["merge", "-q", "--ff-only", "origin/main"]);
} catch {
  stop("クローンの main に GitHub に無いコミットがあります（fast-forward できない）。手で確かめてから");
}
const head = git(["rev-parse", "HEAD"]);
console.log(`  main: ${head.slice(0, 7)}${before !== head ? `（${before.slice(0, 7)} から更新）` : ""}`);

// ------------------------------------------------------------------ 2. other sessions' commits into this tree
step("GitHub 側の新しい変更をこの作業ツリーに取り込む");
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { lastCommit: before };
const upstream = state.lastCommit === head ? [] : git(["diff", "--name-status", state.lastCommit, head]).split("\n").filter(Boolean).map((l) => l.split("\t"));
const conflicts = [];
const incoming = [];
const deletedUpstream = [];
for (const [status, file] of upstream) {
  if (excluded(file)) continue;
  if (status.startsWith("D")) {
    deletedUpstream.push(file);
    continue;
  }
  const local = join(root, file);
  const next = execFileSync("git", ["show", `${head}:${file}`], { cwd: clone, maxBuffer: 1 << 28 });
  if (existsSync(local) && sha(readFileSync(local)) === sha(next)) continue;
  let prior = null;
  try {
    prior = execFileSync("git", ["show", `${state.lastCommit}:${file}`], { cwd: clone, maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    // new upstream
  }
  const untouchedHere = !existsSync(local) || (prior !== null && sha(readFileSync(local)) === sha(prior));
  if (!untouchedHere) conflicts.push(file);
  else incoming.push([file, next]);
}
if (conflicts.length > 0) stop(`GitHub 側とこの作業ツリーの両方で変わったファイルがあります（上書きしません）:\n  ${conflicts.join("\n  ")}`);
if (!dryRun) {
  for (const [file, content] of incoming) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
}
console.log(`  取り込み: ${incoming.length} 件${deletedUpstream.length ? `（GitHub で削除された ${deletedUpstream.length} 件はこの作業ツリーに残しています: ${deletedUpstream.slice(0, 5).join(", ")}）` : ""}`);

// ------------------------------------------------------------------ 3. the one check
step("検査（型検査・全テスト。1回だけ）");
if (dryRun) console.log("  --dry-run のため実行しない");
else {
  for (const [label, args] of /** @type {[string, string[]][]} */ ([
    ["型検査", ["node_modules/typescript/lib/tsc.js", "--noEmit", "-p", "."]],
    ["全テスト", ["node_modules/vitest/vitest.mjs", "run"]],
  ])) {
    try {
      execFileSync(process.execPath, args, { cwd: root, stdio: ["ignore", "ignore", "pipe"], maxBuffer: 1 << 28 });
      console.log(`  ${label}: 合格`);
    } catch (/** @type {any} */ e) {
      const out = `${e.stdout ?? ""}${e.stderr ?? ""}`.split("\n").filter((l) => /FAIL|Error|error TS|✗|×/.test(l)).slice(0, 12).join("\n");
      stop(`${label}が不合格です。公開しません\n${out}`);
    }
  }
}

// ------------------------------------------------------------------ 4. copy, commit, push
step("公開用クローンへコピー");
const here = listed(root);
const there = listed(clone);
const changed = [...here].filter((f) => !excluded(f) && (!there.has(f) || sha(readFileSync(join(root, f))) !== sha(readFileSync(join(clone, f))))).sort();
if (changed.length === 0) {
  console.log("  公開する変更はありません");
  if (!dryRun) writeFileSync(statePath, `${JSON.stringify({ lastCommit: head, at: new Date().toISOString() }, null, 2)}\n`);
  process.exit(0);
}
const companies = changed.filter((f) => /^src\/data\/companies\/[a-z0-9-]+\.json$/.test(f)).map((f) => f.slice(19, -5));
const revisions = changed.filter((f) => f.startsWith("src/data/revisions/")).length;
const code = changed.filter((f) => !/^(src\/data|docs\/research)\//.test(f));
console.log(`  ${changed.length} 件（企業 ${companies.length}・改訂記録 ${revisions}・その他 ${code.length}）`);
if (dryRun) {
  console.log(changed.map((f) => `    ${f}`).join("\n"));
  process.exit(0);
}
for (const f of changed) {
  mkdirSync(dirname(join(clone, f)), { recursive: true });
  copyFileSync(join(root, f), join(clone, f));
}

step("commit・push");
const day = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
const subject = companies.length > 0 ? `Publish ${day}: ${companies.length} company entries` : `Publish ${day}`;
const body = [
  companies.length > 0 ? `Companies: ${companies.slice(0, 40).join(", ")}${companies.length > 40 ? `, … (${companies.length})` : ""}` : "",
  code.length > 0 ? `Other files: ${code.slice(0, 20).join(", ")}${code.length > 20 ? ", …" : ""}` : "",
  "Checked once before publishing: type check and the whole test suite (scripts/publish.mjs).",
  "",
  "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
].filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== "")).join("\n");
git(["add", "-A", "--", ...new Set(changed.map((f) => f.split("/")[0]))]);
git(["commit", "-q", "-m", subject, "-m", body]);
try {
  git(["push", "-q", "origin", "main"]);
} catch (/** @type {any} */ e) {
  stop(`push が拒否されました（${String(e.stderr ?? e.message).split("\n").find((l) => /rejected|declined|error/i.test(l)) ?? "理由不明"}）。コミットはクローンに残っています`);
}
const pushed = git(["rev-parse", "HEAD"]);
writeFileSync(statePath, `${JSON.stringify({ lastCommit: pushed, at: new Date().toISOString() }, null, 2)}\n`);
console.log(`\n✔ 公開しました: ${pushed.slice(0, 7)}（Cloudflare が main から再ビルドします）`);
