import { createHash, randomBytes } from "node:crypto";
import { readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Company } from "@/types/company";
import type { Revision } from "@/types/revision";
import type { Source } from "@/types/source";
import type { Term } from "@/types/term";
import { changedFields, removedSources, revisionSnapshots, type FieldChange } from "./diff";
import { checkCompany, checkTerm, type ContentContext } from "./integrity";
import { companySchema, parseContent, termSchema } from "./schemas";

/**
 * Reads and writes repository content for the LOCAL admin editor. SERVER ONLY.
 *
 * The repository is the source of truth; this module only changes files in the
 * working tree. It never runs git: reviewing the diff, committing and pushing
 * are the operator's explicit actions (docs/correction-workflow.md).
 *
 * A save is refused unless:
 *   - the file has not changed since the editor loaded it (no silent overwrite)
 *   - the draft passes the schema and every integrity rule
 *   - something actually changed
 *   - a summary and a reason are written
 *   - any removed source is explicitly confirmed
 * and it always writes a Revision with the before/after of every changed field.
 */

export type EditableKind = "company" | "term";

const DIRECTORY: Record<EditableKind, string> = { company: "companies", term: "terms" };

export type LoadedContent = { data: Record<string, unknown>; version: string };

export type PreviewResult =
  | { ok: true; changes: FieldChange[]; removedSources: Source[] }
  | { ok: false; errors: string[]; conflict?: boolean };

export type SaveInput = {
  kind: EditableKind;
  id: string;
  draft: unknown;
  baseVersion: string;
  summary: string;
  reason: string;
  confirmSourceRemoval: boolean;
  now?: Date;
};

export type SaveResult =
  | { ok: true; revisionId: string; changedFields: string[]; files: string[] }
  | { ok: false; errors: string[]; conflict?: boolean };

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Where editing is allowed at all. Production never writes to the repository (spec §11). */
export function localEditingStatus(): { enabled: true } | { enabled: false; reason: string } {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL) {
    return { enabled: false, reason: "公開環境では内容を編集できません。ローカル環境（npm run dev）の管理画面で編集してください。" };
  }
  if (process.env.CONTENT_EDITING === "off") {
    return { enabled: false, reason: "CONTENT_EDITING=off のため、編集は無効になっています。" };
  }
  return { enabled: true };
}

function version(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/** "YYYY-MM-DD" in Japan: the date an editor in Japan would write down. */
export function tokyoDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/**
 * Re-order a draft's keys to follow the original file, so the git diff shows
 * what changed and not how the editor happened to rebuild the object.
 */
function orderLike(original: unknown, draft: unknown): unknown {
  if (Array.isArray(draft)) {
    return draft.map((item, i) => orderLike(Array.isArray(original) ? original[i] : undefined, item));
  }
  if (draft && typeof draft === "object") {
    const source = original && typeof original === "object" && !Array.isArray(original) ? (original as Record<string, unknown>) : {};
    const d = draft as Record<string, unknown>;
    const keys = [...Object.keys(source).filter((k) => k in d), ...Object.keys(d).filter((k) => !(k in source))];
    return Object.fromEntries(keys.filter((k) => d[k] !== undefined).map((k) => [k, orderLike(source[k], d[k])]));
  }
  return draft;
}

function schemaErrors(result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }): string[] {
  return result.success ? [] : (result.error?.issues ?? []).map((i) => `${i.path.map(String).join(".") || "(全体)"}: ${i.message}`);
}

export class ContentStore {
  constructor(private readonly root: string) {}

  private path(kind: EditableKind, id: string) {
    return join(this.root, "src", "data", DIRECTORY[kind], `${id}.json`);
  }

  async read(kind: EditableKind, id: string): Promise<LoadedContent | null> {
    if (!ID.test(id)) return null;
    try {
      const text = await readFile(this.path(kind, id), "utf8");
      return { data: JSON.parse(text), version: version(text) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  private async readAll<T>(dir: string): Promise<T[]> {
    let files: string[];
    try {
      files = (await readdir(join(this.root, "src", "data", dir))).filter((f) => f.endsWith(".json"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    return Promise.all(files.map(async (f) => JSON.parse(await readFile(join(this.root, "src", "data", dir, f), "utf8")) as T));
  }

  /** Read fresh from disk — never from the module cache, which lags behind files just saved. */
  private async context(): Promise<ContentContext> {
    const [companies, terms, features] = await Promise.all([
      this.readAll<{ id: string }>("companies"),
      this.readAll<{ id: string }>("terms"),
      this.readAll<{ id: string }>("features"),
    ]);
    return {
      companyIds: new Set(companies.map((c) => c.id)),
      termIds: new Set(terms.map((t) => t.id)),
      featureIds: new Set(features.map((f) => f.id)),
    };
  }

  async preview(kind: EditableKind, id: string, draft: unknown, baseVersion: string): Promise<PreviewResult> {
    const current = await this.read(kind, id);
    if (!current) return { ok: false, errors: ["対象のデータファイルが見つかりません。"] };
    if (current.version !== baseVersion) {
      return {
        ok: false,
        conflict: true,
        errors: ["編集を始めた後に、このファイルが変更されました（git pull など）。ページを再読み込みして、最新の内容から編集し直してください。"],
      };
    }

    const schema = kind === "company" ? companySchema : termSchema;
    const parsed = schema.safeParse(draft);
    if (!parsed.success) return { ok: false, errors: schemaErrors(parsed) };
    const value = parsed.data as Company | Term;
    if (value.id !== id) return { ok: false, errors: ["id は変更できません（URLとファイル名が変わってしまうため）。"] };

    const context = await this.context();
    const integrity = kind === "company" ? checkCompany(value as Company, context) : checkTerm(value as Term, context);
    if (integrity.length > 0) return { ok: false, errors: integrity };

    const changes = changedFields(current.data, value as unknown as Record<string, unknown>);
    if (changes.length === 0) return { ok: false, errors: ["変更がありません。"] };

    return {
      ok: true,
      changes,
      removedSources: removedSources(current.data as { sources: Source[] }, value),
    };
  }

  async save(input: SaveInput): Promise<SaveResult> {
    const preview = await this.preview(input.kind, input.id, input.draft, input.baseVersion);
    if (!preview.ok) return preview;

    const errors: string[] = [];
    const summary = input.summary.trim();
    const reason = input.reason.trim();
    if (!summary) errors.push("変更の要約を書いてください。");
    if (summary.length > 120) errors.push("変更の要約は120文字以内にしてください。");
    if (!reason) errors.push("理由と根拠（出典や報告）を書いてください。");
    if (preview.removedSources.length > 0 && !input.confirmSourceRemoval) {
      errors.push(
        `出典「${preview.removedSources.map((s) => s.title).join("」「")}」を削除します。削除してよいことを確認し、理由を書いてください。`,
      );
    }
    if (errors.length > 0) return { ok: false, errors };

    const now = input.now ?? new Date();
    const current = (await this.read(input.kind, input.id))!;
    const parsed =
      input.kind === "company"
        ? parseContent(companySchema, input.draft, input.id)
        : parseContent(termSchema, input.draft, input.id);
    const draft = { ...parsed, updatedAt: tokyoDate(now) };
    const ordered = orderLike(current.data, draft);

    const revisionId = `${tokyoDate(now)}-${input.kind}-${input.id}-${randomBytes(3).toString("hex")}`;
    const revision: Revision = {
      id: revisionId,
      targetType: input.kind,
      targetId: input.id,
      changedAt: now.toISOString(),
      reason,
      summary,
      ...revisionSnapshots(preview.changes),
    };

    const contentPath = this.path(input.kind, input.id);
    const revisionPath = join(this.root, "src", "data", "revisions", `${revisionId}.json`);
    const suffix = `.${randomBytes(4).toString("hex")}.tmp`;
    await writeFile(`${revisionPath}${suffix}`, `${JSON.stringify(revision, null, 2)}\n`, "utf8");
    await writeFile(`${contentPath}${suffix}`, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");
    // Revision lands first: a content change must never exist without its revision.
    await rename(`${revisionPath}${suffix}`, revisionPath);
    try {
      await rename(`${contentPath}${suffix}`, contentPath);
    } catch (error) {
      await rm(revisionPath, { force: true });
      await rm(`${contentPath}${suffix}`, { force: true });
      throw error;
    }

    return {
      ok: true,
      revisionId,
      changedFields: preview.changes.map((c) => c.field),
      files: [
        `src/data/${DIRECTORY[input.kind]}/${input.id}.json`,
        `src/data/revisions/${revisionId}.json`,
      ],
    };
  }
}
