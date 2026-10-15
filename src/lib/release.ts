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
