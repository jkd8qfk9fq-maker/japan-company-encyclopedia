import { checkCompany, type ContentContext } from "@/lib/content/integrity";
import type { Company } from "@/types/company";

/**
 * The release line: what a reader of the public site can see. A company is released when its page
 * has been written and passed the gates (`published`). `figures-only` and `needs-attention` entries
 * stay in the repository and in the admin editor, but have no public page — they are not listed,
 * not searched, not in the sitemap, not linked from another company, and their URL is a 404.
 * Promoting an entry to `published` is what releases it; nothing else has to change.
 */
export function isReleased(company: Pick<Company, "status">): boolean {
  return company.status.state === "published";
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
