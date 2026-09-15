/**
 * Content reports — types, labels and input validation.
 *
 * Client-safe on purpose: the report form imports the categories and limits
 * from here, so this module must never import a repository, a database driver
 * or a secret. The server re-validates everything with the same function; the
 * form's own checks are only for the reader's convenience.
 *
 * Reports are stored on the server and read only in the authenticated admin
 * (docs/decisions.md, JCE-008). They used to live in the reader's
 * localStorage, where no editor could ever see them.
 */

export const REPORT_CATEGORIES = [
  "company-information",
  "business-information",
  "financial-information",
  "history",
  "industry-classification",
  "other",
] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  "company-information": "企業の基本情報",
  "business-information": "事業の説明",
  "financial-information": "売上・利益の数値",
  history: "歴史",
  "industry-classification": "業界の分類",
  other: "その他",
};

export const REPORT_STATUSES = ["open", "investigating", "resolved", "rejected"] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  open: "未対応",
  investigating: "調査中",
  resolved: "解決済み",
  rejected: "対応不要",
};

export const MAX_REPORT_LENGTH = 2000;
export const MAX_ADMIN_NOTE_LENGTH = 4000;

export type ContentReport = {
  id: string;
  companyId?: string;
  industryId?: string;
  featureId?: string;
  category: ReportCategory;
  message: string;
  /** The page the reader reported from, so the editor can find the claim. */
  pagePath?: string;
  createdAt: string;
  status: ReportStatus;
  /** The editor's correction notes. Admin only; never set from the public form. */
  adminNote?: string;
};

export type ReportInput = Pick<ContentReport, "companyId" | "industryId" | "featureId" | "category" | "message" | "pagePath">;

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** A same-origin path of lowercase kebab segments. A second "/" or "\" after the first makes it off-site. */
const PAGE_PATH_PATTERN = /^\/(?![/\\])[a-z0-9/-]*$/;

export type ReportValidation =
  | { ok: true; value: ReportInput }
  | { ok: false; error: "category" | "message" | "too-long" };

/**
 * The single gate for untrusted report input — form fields posted by anyone.
 * Optional ids and paths that fail their pattern are dropped rather than
 * rejecting the report: a reader's correction is still worth keeping.
 */
export function validateReportInput(raw: {
  companyId?: unknown;
  industryId?: unknown;
  featureId?: unknown;
  category?: unknown;
  message?: unknown;
  pagePath?: unknown;
}): ReportValidation {
  if (!REPORT_CATEGORIES.includes(raw.category as ReportCategory)) return { ok: false, error: "category" };
  if (typeof raw.message !== "string") return { ok: false, error: "message" };
  // Normalise line endings so the length limit means the same thing on every OS.
  const message = raw.message.replace(/\r\n?/g, "\n").trim();
  if (message.length === 0) return { ok: false, error: "message" };
  if (message.length > MAX_REPORT_LENGTH) return { ok: false, error: "too-long" };

  const id = (x: unknown) => (typeof x === "string" && ID_PATTERN.test(x) ? x : undefined);
  return {
    ok: true,
    value: {
      category: raw.category as ReportCategory,
      message,
      companyId: id(raw.companyId),
      industryId: id(raw.industryId),
      featureId: id(raw.featureId),
      pagePath: typeof raw.pagePath === "string" && PAGE_PATH_PATTERN.test(raw.pagePath) ? raw.pagePath : undefined,
    },
  };
}

export function isReportStatus(value: unknown): value is ReportStatus {
  return REPORT_STATUSES.includes(value as ReportStatus);
}
