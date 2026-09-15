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
export class FileRevisionRepository implements RevisionRepository {
  constructor(private readonly dir: string) {}

  async list(): Promise<Revision[]> {
    let files: string[];
    try {
      files = (await readdir(this.dir)).filter((f) => f.endsWith(".json"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    const revisions = await Promise.all(
      files.map(async (file) => {
        const revision = parseContent(revisionSchema, JSON.parse(await readFile(join(this.dir, file), "utf8")), `src/data/revisions/${file}`);
        // The file name is the id: a copied file with a stale id would otherwise shadow another revision.
        if (`${revision.id}.json` !== file) throw new Error(`src/data/revisions/${file}: id "${revision.id}" does not match the file name`);
        return revision as Revision;
      }),
    );
    return revisions.sort((a, b) => b.changedAt.localeCompare(a.changedAt) || b.id.localeCompare(a.id));
  }

  async listForTarget(targetType: RevisionTargetType, targetId: string): Promise<Revision[]> {
    return (await this.list()).filter((r) => r.targetType === targetType && r.targetId === targetId);
  }

  async get(id: string): Promise<Revision | null> {
    return (await this.list()).find((r) => r.id === id) ?? null;
  }
}
