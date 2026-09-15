/**
 * npm run content:validate-file -- <path to a content JSON file>
 *
 * Runs tests/validate-file.test.ts for one file: schema, integrity rules, id
 * matching the file name, and (for companies) an initial revision record.
 * Works for files not yet registered in an index.
 */
import { spawnSync } from "node:child_process";

const file = process.argv[2];
if (!file) {
  console.error("使い方: npm run content:validate-file -- src/data/companies/<id>.json");
  process.exit(1);
}
const result = spawnSync("npx", ["vitest", "run", "tests/validate-file.test.ts"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, CONTENT_FILE: file },
});
process.exit(result.status ?? 1);
