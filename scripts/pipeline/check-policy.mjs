/**
 * The writing rules as a check (prose-policy.mjs): one-sentence description, the business as the subject,
 * no financial figures but revenue and net income, links that rest on an identity AND a relationship.
 *
 *   node scripts/pipeline/check-policy.mjs <company-id>                  the staged entry (pipeline/staging/<id>.json)
 *   node scripts/pipeline/check-policy.mjs <company-id> --fragments      the agents' fragments, merged
 *   node scripts/pipeline/check-policy.mjs <company-id> --entry <path>   any entry file
 *   … [--json]
 *
 * Exit 1 when there is an error. `review` and `info` findings never fail the check; they are what the review
 * sheet shows the person who confirms the registration. No model tokens, no network.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadState } from "./company-state.mjs";
import { mergeEntry } from "./merge-fragments.mjs";
import { policyFindings } from "./policy-context.mjs";
import { errorsOf } from "./prose-policy.mjs";
import { inScope, updateScope } from "./update-scope.mjs";

const companyId = process.argv[2];
if (!companyId || companyId.startsWith("--")) {
  console.error("usage: node scripts/pipeline/check-policy.mjs <company-id> [--fragments | --entry <path>] [--json]");
  process.exit(1);
}
const flag = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? (process.argv[i + 1] ?? true) : null;
};

let entry;
if (process.argv.includes("--fragments")) {
  entry = mergeEntry(companyId).entry;
} else {
  const path = flag("entry") ?? join("pipeline/staging", `${companyId}.json`);
  if (!existsSync(path)) {
    console.error(`${companyId}: ${path} がありません`);
    process.exit(1);
  }
  entry = JSON.parse(readFileSync(path, "utf8"));
}

// During an update (update-scope.mjs) only the rewritten part counts: the rest is the published text, written from
// the older filing, and checking it against this pack would send the agent to rewrite what it was told to keep.
const scope = updateScope(loadState(companyId).identity);
const all = policyFindings(entry);
const findings = all.filter((f) => inScope(f.path, scope));
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  const label = { error: "不備", review: "確認", info: "注意" };
  for (const f of findings) console.log(`  ${label[f.severity]} [${f.rule}] ${f.path}: ${f.message}${f.excerpt ? `（…${f.excerpt}…）` : ""}`);
  const e = errorsOf(findings).length;
  if (all.length > findings.length) console.log(`${companyId}: 更新中。書き直していない部分（${scope?.kept.join("・")}）の ${all.length - findings.length} 件は数えない（公開中のまま）`);
  console.log(`${companyId}: 不備 ${e} 件・確認 ${findings.filter((f) => f.severity === "review").length} 件・注意 ${findings.filter((f) => f.severity === "info").length} 件`);
}
process.exit(errorsOf(findings).length > 0 ? 1 : 0);
