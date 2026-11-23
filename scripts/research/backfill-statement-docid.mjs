/**
 * asFiledIn for the statements layer (JCE-098): set `docId` on every financialStatements block
 * that does not carry one yet — the EDINET document the block's rows were read from.
 *
 * statement-details.mjs reads both years of a block out of ONE filing: the newest `financials`
 * record's own filing (its current-year column and its prior-year column). The reading document
 * is therefore identifiable from the entry itself, with no fetch, exactly when every year of the
 * block is one of the entry's newest two records (a block can hold a single year, when the other
 * year of the filing failed the cross-checks and was not kept). A block holding any other year
 * (the entry has since been refreshed to a newer filing) is left without a docId and reported —
 * which document it was read from is then not provable from the entry, and guessing it would put
 * a false provenance on printed figures (invariant 1).
 *
 * The docId is resolved from the newest record's sources the same way statement-details.mjs
 * resolves it (the source the record cites, its docId field or the id in its URL).
 *
 * Usage: node scripts/research/backfill-statement-docid.mjs [--write]
 * Without --write it only counts. Follows the JCE-097 backfill precedent: no per-company
 * revision file, no `updatedAt` change; the batch is recorded in docs/decisions.md (JCE-098).
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const write = process.argv.includes("--write");
const dir = join(root, "src/data/companies");
const counts = { withStatements: 0, already: 0, set: 0, stale: 0, noDocId: 0 };
const staleIds = [];

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const path = join(dir, file);
  const entry = JSON.parse(readFileSync(path, "utf8"));
  if (!entry.financialStatements) continue;
  counts.withStatements++;
  if (entry.financialStatements.every((s) => s.docId)) {
    counts.already++;
    continue;
  }
  const records = [...entry.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  const latest = records.at(-1);
  const prev = records.at(-2);
  const topEnds = new Set([prev?.periodEnd, latest?.periodEnd]);
  if (!latest || !entry.financialStatements.every((s) => topEnds.has(s.periodEnd))) {
    counts.stale++;
    staleIds.push(entry.id);
    continue;
  }
  const source = entry.sources.find((s) => latest.sourceIds.includes(s.id)) ?? entry.sources.find((s) => s.id === latest.sourceIds[0]);
  const docId = source?.docId ?? /S[0-9A-Z]{7}/.exec(source?.url ?? "")?.[0];
  if (!docId) {
    counts.noDocId++;
    continue;
  }
  counts.set++;
  if (write) {
    const next = {
      ...entry,
      financialStatements: entry.financialStatements.map((s) => ({ ...s, docId: s.docId ?? docId })),
    };
    writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
  }
}
console.log(JSON.stringify(counts, null, 2));
if (staleIds.length > 0) console.log(`stale (left without docId): ${staleIds.join(", ")}`);
