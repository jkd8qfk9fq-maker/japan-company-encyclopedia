import { createHash, randomBytes } from "node:crypto";
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renameWithRetry } from "@/lib/fs/atomic-rename";
import { buildSave, EDIT_DIRECTORY, EDIT_ID, previewEdit, saveInputErrors, type EditableKind, type PreviewResult } from "./content-edit";
import type { ContentContext } from "./integrity";

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

export type { EditableKind, PreviewResult } from "./content-edit";
export { tokyoDate } from "./content-edit";

const DIRECTORY = EDIT_DIRECTORY;

export type LoadedContent = { data: Record<string, unknown>; version: string };

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

const ID = EDIT_ID;

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

    return previewEdit(kind, id, current.data, draft, await this.context());
  }

  async save(input: SaveInput): Promise<SaveResult> {
    const preview = await this.preview(input.kind, input.id, input.draft, input.baseVersion);
    if (!preview.ok) return preview;

    const summary = input.summary.trim();
    const reason = input.reason.trim();
    const errors = saveInputErrors(preview, summary, reason, input.confirmSourceRemoval);
    if (errors.length > 0) return { ok: false, errors };

    const now = input.now ?? new Date();
    const current = (await this.read(input.kind, input.id))!;
    const { revisionId, files } = buildSave({ kind: input.kind, id: input.id, current: current.data, draft: input.draft, changes: preview.changes, summary, reason, now });
    const [revisionFile, contentFile] = files;

    const contentPath = this.path(input.kind, input.id);
    const revisionPath = join(this.root, "src", "data", "revisions", `${revisionId}.json`);
    const suffix = `.${randomBytes(4).toString("hex")}.tmp`;
    await writeFile(`${revisionPath}${suffix}`, revisionFile!.text, "utf8");
    await writeFile(`${contentPath}${suffix}`, contentFile!.text, "utf8");
    // Revision lands first: a content change must never exist without its revision.
    await renameWithRetry(`${revisionPath}${suffix}`, revisionPath);
    try {
      await renameWithRetry(`${contentPath}${suffix}`, contentPath);
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
