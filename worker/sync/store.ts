/** Where pending transfers live (JCE-065): D1 in production, memory in tests. */
export interface SyncStore {
  put(id: string, cancelId: string, data: string, expiresAt: number): Promise<void>;
  /** Read once: the row is gone after this, whether or not it had expired. */
  take(id: string): Promise<{ data: string; expiresAt: number } | null>;
  cancel(cancelId: string): Promise<void>;
  prune(now: number): Promise<void>;
}

type D1Like = {
  prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown>; first<T>(): Promise<T | null> } };
};

export function d1SyncStore(db: D1Like): SyncStore {
  return {
    async put(id, cancelId, data, expiresAt) {
      await db.prepare("INSERT INTO sync_transfers (id, cancel_id, data, expires_at) VALUES (?, ?, ?, ?)").bind(id, cancelId, data, expiresAt).run();
    },
    async take(id) {
      const row = await db.prepare("DELETE FROM sync_transfers WHERE id = ? RETURNING data, expires_at").bind(id).first<{ data: string; expires_at: number }>();
      return row ? { data: row.data, expiresAt: row.expires_at } : null;
    },
    async cancel(cancelId) {
      await db.prepare("DELETE FROM sync_transfers WHERE cancel_id = ?").bind(cancelId).run();
    },
    async prune(now) {
      await db.prepare("DELETE FROM sync_transfers WHERE expires_at < ?").bind(now).run();
    },
  };
}

export function memorySyncStore(): SyncStore & { rows: Map<string, { cancelId: string; data: string; expiresAt: number }> } {
  const rows = new Map<string, { cancelId: string; data: string; expiresAt: number }>();
  return {
    rows,
    async put(id, cancelId, data, expiresAt) {
      rows.set(id, { cancelId, data, expiresAt });
    },
    async take(id) {
      const row = rows.get(id);
      rows.delete(id);
      return row ? { data: row.data, expiresAt: row.expiresAt } : null;
    },
    async cancel(cancelId) {
      for (const [id, row] of rows) if (row.cancelId === cancelId) rows.delete(id);
    },
    async prune(now) {
      for (const [id, row] of rows) if (row.expiresAt < now) rows.delete(id);
    },
  };
}
