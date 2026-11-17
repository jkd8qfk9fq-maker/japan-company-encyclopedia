import releasedWithNotesJson from "@/data/released-with-notes.json";
import { checkCompany, type ContentContext } from "@/lib/content/integrity";
import { parseContent, releasedWithNotesSchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";

/**
 * Needs-attention entries released with their notes shown (JCE-057): the notes record facts a reader should know —
 * a tender offer, an event after the balance-sheet date, a stock split, the basis a table follows — not something
 * missing or doubtful. An explicit list, reviewed and committed, so what is public never depends on a guess at runtime.
 */
const releasedWithNotes = new Set(
  parseContent(releasedWithNotesSchema, releasedWithNotesJson, "src/data/released-with-notes.json").companies,
);

/**
 * The release line: what a reader of the public site can see. A company is released when its page
 * has been written and passed the gates (`published`), or when it is a `needs-attention` entry on the reviewed list
 * of JCE-057 — its page then shows the notes. `figures-only` and the other `needs-attention` entries stay in the
 * repository and in the admin editor, but have no public page — they are not listed, not searched, not in the
 * sitemap, not linked from another company, and their URL is a 404.
 */
export function isReleased(company: Pick<Company, "id" | "status">): boolean {
  return company.status.state === "published" || (company.status.state === "needs-attention" && releasedWithNotes.has(company.id));
}

/** The notes of a released needs-attention entry, as a reader sees them (JCE-057); none for any other entry. */
export function publicNotes(company: Pick<Company, "id" | "status">): string[] {
  if (company.status.state !== "needs-attention" || !releasedWithNotes.has(company.id)) return [];
  // The editors' notes start with the section they concern ("businessModel: …"): the reader needs the fact, not the
  // field name. One fact written against two sections appears once.
  const seen = new Set<string>();
  return company.status.notes
    .map((n) => n.replace(/^[A-Za-z]+:\s*/, "").trim())
    .filter((n) => n.length > 0 && !seen.has(n) && seen.add(n));
}

export type Readiness = {
  /** Would promoting this entry to `published` leave the integrity rules satisfied, with nothing left to review? */
  ready: boolean;
  /** What the integrity rules would reject if the entry were `published` — what is still missing or wrong. */
  problems: string[];
  /** Review notes a person has to resolve first (`needs-attention` entries). */
  notes: string[];
};

/**
 * Release readiness: the same rules the published tier is held to (checkCompany), applied to an entry as if it
 * were already `published`. The operator-only draft console shows this next to every unreleased entry. It decides
 * nothing — promotion is still a commit — it only says what stands between the entry and the public site.
 */
export function releaseReadiness(company: Company, context: ContentContext): Readiness {
  const problems = checkCompany({ ...company, status: { state: "published" } }, context);
  const notes = company.status.state === "needs-attention" ? company.status.notes : [];
  return { ready: problems.length === 0 && notes.length === 0, problems, notes };
}
