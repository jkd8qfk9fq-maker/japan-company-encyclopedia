import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseContent, revisionSchema } from "@/lib/content/schemas";
import type { Revision, RevisionTargetType } from "@/types/revision";
import type { RevisionRepository } from "./repositories";

/**
 * Revisions are one JSON file each in src/data/revisions/. SERVER ONLY.
 *
 * Read from the filesystem rather than imported like other content because
 * the local editor ADDS files here, and an import list would have to be
 * rewritten on every save. Pages that read revisions at request time need
 * the directory traced into the deployment (next.config.ts,
 * outputFileTracingIncludes).
 */

/** A revision id that marks the change as a correction of what was published — the updates feed's rule (JCE-052). */
const CORRECTION_ID = /-correct(ed|ion)(-\d+)?$/;

const byNewest = (a: Revision, b: Revision) => b.changedAt.localeCompare(a.changedAt) || b.id.localeCompare(a.id);

export class FileRevisionRepository implements RevisionRepository {
  constructor(private readonly dir: string) {}

  private async readRevision(file: string): Promise<Revision> {
    const revision = parseContent(revisionSchema, JSON.parse(await readFile(join(this.dir, file), "utf8")), `src/data/revisions/${file}`);
    // The file name is the id: a copied file with a stale id would otherwise shadow another revision.
    if (`${revision.id}.json` !== file) throw new Error(`src/data/revisions/${file}: id "${revision.id}" does not match the file name`);
    return revision as Revision;
  }

  private async fileNames(): Promise<string[]> {
    try {
      return (await readdir(this.dir)).filter((f) => f.endsWith(".json"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  async list(): Promise<Revision[]> {
    const files = await this.fileNames();
    const revisions = await Promise.all(files.map((file) => this.readRevision(file)));
    return revisions.sort(byNewest);
  }

  async listForTarget(targetType: RevisionTargetType, targetId: string): Promise<Revision[]> {
    return (await this.list()).filter((r) => r.targetType === targetType && r.targetId === targetId);
  }

  async listCorrectionsForTarget(targetType: RevisionTargetType, targetId: string): Promise<Revision[]> {
    // The file name is the revision id, and the id names its target and its kind
    // (<date>-<targetType>-<targetId>-…), so the directory listing alone narrows the read to a handful of
    // files. A name is a hint, not a fact: an id that merely contains the target's (a longer company id
    // sharing its prefix) is read and then rejected by content below.
    const infix = `-${targetType}-${targetId}-`;
    const candidates = (await this.fileNames()).filter((f) => f.includes(infix) && CORRECTION_ID.test(f.slice(0, -".json".length)));
    const revisions = await Promise.all(candidates.map((file) => this.readRevision(file)));
    return revisions.filter((r) => r.targetType === targetType && r.targetId === targetId).sort(byNewest);
  }

  async get(id: string): Promise<Revision | null> {
    return (await this.list()).find((r) => r.id === id) ?? null;
  }
}
