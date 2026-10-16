/**
 * Finish a registration that was interrupted AFTER it wrote the company's files.
 *
 *   node scripts/pipeline/recover-registration.mjs <company-id> [--dry-run]
 *
 * For a company whose `registration` stage is still `running` although its entry, revision, research
 * log and index line are all in place. It checks that the entry on disk is exactly what the existing
 * fragments produce, that the revision and log are there once, and that the integrity suite and the
 * type check pass; then it does what `finalize.mjs` does last — `registeredAt`, `registration:
 * completed`, taxonomy gaps, staging file — and nothing else. It never writes an entry, a revision, a
 * research log or an index line. If any check fails it changes nothing and exits 1. Running it again
 * on a company that is already complete does nothing (exit 0).
 *
 * See registration-tail.mjs for the reasoning. No git operation happens here.
 */
import { recoverRegistration } from "./registration-tail.mjs";

const companyId = process.argv[2];
if (!companyId || companyId.startsWith("--")) {
  console.error("usage: node scripts/pipeline/recover-registration.mjs <company-id> [--dry-run]");
  process.exit(1);
}

const result = recoverRegistration(companyId, { dryRun: process.argv.includes("--dry-run") });
console.log(`${companyId}: ${result.reason}`);
for (const action of result.actions) console.log(`  ${result.changed ? "実施" : "予定"}: ${action}`);
process.exit(result.ok ? 0 : 1);
