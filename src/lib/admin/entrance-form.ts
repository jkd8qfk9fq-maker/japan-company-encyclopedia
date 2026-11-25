import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * What the operator-only entrance-form page reads and writes: the applications to the free one-company
 * analysis trial (the Google Form linked from the site and the Instagram profile). SERVER ONLY, and only
 * ever called from /admin pages and actions behind requireAdmin.
 *
 * The answers hold personal data (a contact email), so they live in exactly one place: `.data/entrance-form.json`,
 * a git-ignored local state file written by scripts/admin/sync-entrance-form.mjs from the same Google Forms
 * connector read the morning check uses (docs/decisions.md, JCE-115). They are never committed and never
 * rendered on a public page. The file does not exist on the production server, where this reports
 * `available: false` instead of pretending there are no applications.
 */

export const ENTRANCE_STATUSES = ["new", "delivered", "beta-sent", "declined"] as const;

export type EntranceStatus = (typeof ENTRANCE_STATUSES)[number];

export const ENTRANCE_STATUS_LABEL: Record<EntranceStatus, string> = {
  new: "未対応",
  delivered: "体験提供済み",
  "beta-sent": "β案内済み",
  declined: "見送り",
};

export const MAX_ENTRANCE_MEMO_LENGTH = 2000;

export type EntranceEntry = {
  responseId: string;
  /** The form's submission timestamp (ISO, as Google returns it). */
  submittedAt: string;
  email: string;
  /** The company the applicant named — a name or a securities code, exactly as written. */
  company: string;
  /** True when the β案内希望 answer was 「希望する」. */
  betaInterest: boolean;
  status: EntranceStatus;
  memo: string;
  /** When the operator last changed the status or memo; null until then. */
  statusUpdatedAt: string | null;
};

type EntranceStateFile = {
  formId: string;
  syncedAt: string;
  entries: EntranceEntry[];
};

export type EntranceSummary = { total: number; pending: number; betaInterest: number };

export type EntranceView = {
  available: boolean;
  entries: EntranceEntry[];
  summary: EntranceSummary;
  syncedAt: string | null;
};

export const isEntranceStatus = (v: unknown): v is EntranceStatus =>
  typeof v === "string" && (ENTRANCE_STATUSES as readonly string[]).includes(v);

const statePath = (root: string) => join(root, ".data", "entrance-form.json");

const isEntry = (v: unknown): v is EntranceEntry => {
  if (!v || typeof v !== "object") return false;
  const e = v as EntranceEntry;
  return (
    typeof e.responseId === "string" &&
    typeof e.submittedAt === "string" &&
    typeof e.email === "string" &&
    typeof e.company === "string" &&
    typeof e.betaInterest === "boolean" &&
    isEntranceStatus(e.status) &&
    typeof e.memo === "string"
  );
};

const readState = (root: string): EntranceStateFile | null => {
  try {
    const parsed = JSON.parse(readFileSync(statePath(root), "utf8")) as EntranceStateFile;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.entries)) return null;
    return { formId: String(parsed.formId ?? ""), syncedAt: String(parsed.syncedAt ?? ""), entries: parsed.entries.filter(isEntry) };
  } catch {
    return null;
  }
};

export function summarizeEntrance(entries: EntranceEntry[]): EntranceSummary {
  return {
    total: entries.length,
    pending: entries.filter((e) => e.status === "new").length,
    betaInterest: entries.filter((e) => e.betaInterest).length,
  };
}

export function loadEntranceView(root = process.cwd()): EntranceView {
  if (!existsSync(statePath(root))) return { available: false, entries: [], summary: summarizeEntrance([]), syncedAt: null };
  const state = readState(root);
  if (!state) return { available: false, entries: [], summary: summarizeEntrance([]), syncedAt: null };
  const entries = [...state.entries].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return { available: true, entries, summary: summarizeEntrance(entries), syncedAt: state.syncedAt || null };
}

/**
 * Records the operator's handling of one application. Returns false when there is no state file or no such
 * entry — the caller treats that as "nothing to save", never as an error worth showing the applicant's data for.
 */
export function updateEntranceEntry(
  root: string,
  responseId: string,
  patch: { status?: EntranceStatus; memo?: string },
  now = new Date().toISOString(),
): boolean {
  const state = readState(root);
  if (!state) return false;
  const entry = state.entries.find((e) => e.responseId === responseId);
  if (!entry) return false;
  if (patch.status !== undefined) entry.status = patch.status;
  if (patch.memo !== undefined) entry.memo = patch.memo.slice(0, MAX_ENTRANCE_MEMO_LENGTH);
  entry.statusUpdatedAt = now;
  writeFileSync(statePath(root), `${JSON.stringify(state, null, 2)}\n`, "utf8");
  return true;
}
