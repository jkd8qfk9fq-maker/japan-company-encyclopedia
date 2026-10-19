/**
 * Read-only: how many already-registered, described companies break the writing rules (prose-policy.mjs)?
 *
 *   node scripts/pipeline/audit-policy.mjs [--list <rule>]
 *
 * The rules came after these entries were written, so they are not applied to them (data-integrity does not look)
 * — this is the measure of the gap, for the operator's decision (docs/autopilot-decisions.md, judgement 3). It writes
 * nothing. It checks the prose rules only: the link rules need the filing's text, which is not kept for every company.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { checkProsePolicy } from "./prose-policy.mjs";

const dir = join(process.cwd(), "src/data/companies");
const list = process.argv.includes("--list") ? process.argv[process.argv.indexOf("--list") + 1] : null;
/** @type {Record<string, { n: number, hit: number, rules: Record<string, number> }>} */
const tiers = {};
const listed = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const entry = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const tier = entry.status?.state ?? "published";
  if (tier === "figures-only") continue;
  const rules = new Set(checkProsePolicy(entry).filter((x) => x.severity === "error").map((x) => x.rule));
  tiers[tier] ??= { n: 0, hit: 0, rules: {} };
  tiers[tier].n += 1;
  if (rules.size > 0) tiers[tier].hit += 1;
  for (const r of rules) tiers[tier].rules[r] = (tiers[tier].rules[r] ?? 0) + 1;
  if (list && rules.has(list)) listed.push(`${tier}\t${entry.id}`);
}
for (const [tier, t] of Object.entries(tiers)) {
  console.log(`${tier}: ${t.n} 社のうち規則に当たるもの ${t.hit} 社`);
  for (const [rule, n] of Object.entries(t.rules).sort((a, b) => b[1] - a[1])) console.log(`    ${rule.padEnd(28)} ${n}`);
}
if (list) console.log(`\n--list ${list}:\n${listed.join("\n")}`);
