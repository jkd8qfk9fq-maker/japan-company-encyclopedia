import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { checkCompany, checkIndustry, checkTerm } from "@/lib/content/integrity";
import { companySchema, industrySchema, termSchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import type { Industry } from "@/types/industry";
import type { Term } from "@/types/term";

/**
 * Validates ONE content file, registered or not, against the schema and the
 * shared integrity rules — the check a researcher runs before handing an entry
 * over for registration:
 *
 *   npm run content:validate-file -- src/data/companies/honda.json
 *
 * Skipped when CONTENT_FILE is unset, so it adds nothing to a normal test run.
 */
/**
 * One file, or every .json in a directory. The directory form exists because the
 * figures-only tier registers companies in batches of hundreds: starting vitest
 * once per company would cost more time than building the entries did.
 */
const target = process.env.CONTENT_FILE;
const targetDir = process.env.CONTENT_DIR;
const targets = target
  ? [target]
  : targetDir
    ? readdirSync(join(process.cwd(), targetDir))
        .filter((f) => f.endsWith(".json"))
        .map((f) => join(targetDir, f))
    : [];

const ids = (dir: string) =>
  new Set(readdirSync(join(process.cwd(), "src/data", dir)).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")));

describe.skipIf(targets.length === 0)("content file", () => {
  it.each(targets)("is valid: %s", (target) => {
    const path = resolve(process.cwd(), target);
    const data = JSON.parse(readFileSync(path, "utf8"));
    const context = { companyIds: ids("companies"), termIds: ids("terms"), featureIds: ids("features") };
    // An industry is told apart by its shape: the industry writer stages it outside src/data/industries.
    const kind = path.includes(`${join("src", "data", "terms")}`) ? "term" : "structure" in data && "categories" in data ? "industry" : "company";

    const parsed = (kind === "company" ? companySchema : kind === "industry" ? industrySchema : termSchema).safeParse(data);
    const schemaErrors = parsed.success ? [] : parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    expect(schemaErrors, "schema").toEqual([]);

    expect((data as { id: string }).id, "id must equal the file name").toBe(basename(path, ".json"));
    const companies = () =>
      readdirSync(join(process.cwd(), "src/data/companies"))
        .filter((f) => f.endsWith(".json"))
        .map((f) => JSON.parse(readFileSync(join(process.cwd(), "src/data/companies", f), "utf8")) as Company);
    const rules =
      kind === "company"
        ? checkCompany(parsed.data as Company, context)
        : kind === "industry"
          ? checkIndustry(parsed.data as Industry, { ...context, companies: companies() })
          : checkTerm(parsed.data as Term, context);
    expect(rules, "integrity rules").toEqual([]);

    // A revision record describes a REGISTERED entry, so it is only required of
    // one. The pipeline validates an assembled entry while it is still staged
    // outside src/data/companies, and writing its revision first would break
    // data-integrity.test.ts, which requires every revision to point at an entry
    // that exists. Registration writes entry and revision together; that every
    // registered company has one is checked there, not here.
    if (kind === "company" && path.startsWith(join(process.cwd(), "src", "data", "companies"))) {
      const revisions = readdirSync(join(process.cwd(), "src/data/revisions")).filter((f) => f.includes(`-company-${data.id}-`));
      expect(revisions.length, "an initial revision file must exist").toBeGreaterThan(0);
    }
  });
});
