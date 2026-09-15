/**
 * Shows what the local editor changed, before you commit.
 *
 *   npm run content:diff
 *
 * READ-ONLY. It runs `git status` and `git diff` on src/data and nothing else:
 * it never stages, commits, resets or pushes. Those stay your explicit actions.
 */
import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });

const status = git("status", "--short", "--", "src/data");
if (status.trim() === "") {
  console.log("src/data に未コミットの変更はありません。");
  process.exit(0);
}

console.log("── 変更されたファイル（M=変更, ??=新規の改訂記録など）──");
console.log(status);

const revisions = status
  .split("\n")
  .filter((line) => line.includes("src/data/revisions/"))
  .map((line) => line.slice(3).trim());
if (revisions.length > 0) {
  console.log("── 新しい改訂記録 ──");
  for (const file of revisions) {
    try {
      const r = JSON.parse(execFileSync("node", ["-e", `process.stdout.write(require("fs").readFileSync(${JSON.stringify(file)}, "utf8"))`], { encoding: "utf8" }));
      console.log(`${r.id}\n  対象: ${r.targetType} ${r.targetId}\n  要約: ${r.summary}\n  理由: ${r.reason ?? "（なし）"}\n`);
    } catch {
      console.log(`${file}（読み取れませんでした）`);
    }
  }
}

console.log("── 差分（コンテンツ）──");
console.log(git("--no-pager", "diff", "--", "src/data/companies", "src/data/industries", "src/data/terms", "src/data/features") || "（既存ファイルの差分なし）");
console.log("問題がなければ: npm run content:check → git add src/data → git commit → git push");
