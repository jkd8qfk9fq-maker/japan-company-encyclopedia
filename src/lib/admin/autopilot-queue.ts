import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * What the operator-only registration queue page reads: the autopilot's run records, review sheets and history
 * (scripts/pipeline/autopilot.mjs). SERVER ONLY, and only ever called from /admin pages behind requireAdmin.
 *
 * These files are the operator's local working state (git-ignored, written by a program running on the machine that
 * holds the evidence). They do not exist on the production server, where this reports `available: false` instead of
 * pretending the queue is empty. Nothing here writes: approving a company is a command on the local machine.
 */

export type RunStatus = "queued" | "running" | "awaiting-ai" | "paused" | "held" | "ready" | "ready-with-flags" | "registered" | "discarded";

export type RunRecord = {
  id: string;
  status: RunStatus;
  step: string;
  attempts: Record<string, number>;
  holds: { kind: string; reason: string }[];
  errors: { at: string; step: string; kind: string; message: string }[];
  cost: { usd: number; calls: number };
  pause: { kind: string; hint: string | null; at: string } | null;
  awaiting: { group: string; order: string } | null;
  review: { hash: string; readiness: string; errors: number; reviews: number } | null;
  approval: { at: string; hash: string } | null;
  startedAt: string;
  updatedAt: string;
};

export type QueueEvent = { at: string; id: string; type: string; [key: string]: unknown };

export const STATUS_LABEL: Record<RunStatus, string> = {
  queued: "待機中",
  running: "処理中",
  "awaiting-ai": "AI の作業待ち",
  paused: "一時停止",
  held: "保留",
  ready: "確認待ち",
  "ready-with-flags": "確認待ち（要確認つき）",
  registered: "登録済み",
  discarded: "取り下げ",
};

/** The order the operator should look at things. Mirrors operatorList in scripts/pipeline/autopilot-lib.mjs. */
const ATTENTION_RANK: Partial<Record<RunStatus, number>> = { ready: 0, "ready-with-flags": 1, held: 2, paused: 3, "awaiting-ai": 4 };

export const NEXT_ACTION: Record<string, string> = {
  ready: "確認シートを読み、問題なければ approve",
  "ready-with-flags": "確認シートの「確認事項」を読んで判断し、approve（または discard）",
  held: "原因を直す、または discard。直したら retry",
  paused: "上限が解けたら run を再開",
  "awaiting-ai": "AI の作業（注文書）を実行してから run",
};

const read = <T,>(path: string): T | null => {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
};

const isRecord = (v: unknown): v is RunRecord => !!v && typeof v === "object" && typeof (v as RunRecord).id === "string" && typeof (v as RunRecord).status === "string";

export function loadQueueView(root = process.cwd()): { available: boolean; records: RunRecord[]; attention: RunRecord[]; history: QueueEvent[]; lastCheck: { at: string; ok: boolean } | null } {
  const dir = join(root, "pipeline/autopilot");
  if (!existsSync(dir)) return { available: false, records: [], attention: [], history: [], lastCheck: null };
  const runs = join(dir, "runs");
  const records = existsSync(runs)
    ? readdirSync(runs)
        .filter((f) => f.endsWith(".json"))
        .map((f) => read<RunRecord>(join(runs, f)))
        .filter(isRecord)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    : [];
  const attention = records
    .filter((r) => r.status in ATTENTION_RANK)
    .sort((a, b) => (ATTENTION_RANK[a.status] ?? 9) - (ATTENTION_RANK[b.status] ?? 9) || a.id.localeCompare(b.id));
  const historyPath = join(dir, "history.jsonl");
  const history: QueueEvent[] = existsSync(historyPath)
    ? readFileSync(historyPath, "utf8")
        .split("\n")
        .filter(Boolean)
        .slice(-60)
        .flatMap((l) => {
          try {
            return [JSON.parse(l) as QueueEvent];
          } catch {
            return [];
          }
        })
        .reverse()
    : [];
  return { available: true, records, attention, history, lastCheck: read<{ at: string; ok: boolean }>(join(dir, "last-check.json")) };
}

/** One company's run record and review sheet, or null. `id` is checked against the id grammar: it becomes a file name. */
export function loadRun(id: string, root = process.cwd()): { record: RunRecord; sheet: string | null; events: QueueEvent[] } | null {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) return null;
  const dir = join(root, "pipeline/autopilot");
  const record = read<RunRecord>(join(dir, "runs", `${id}.json`));
  if (!isRecord(record)) return null;
  const sheetPath = join(dir, "review", `${id}.md`);
  const view = loadQueueView(root);
  return { record, sheet: existsSync(sheetPath) ? readFileSync(sheetPath, "utf8") : null, events: view.history.filter((e) => e.id === id) };
}
