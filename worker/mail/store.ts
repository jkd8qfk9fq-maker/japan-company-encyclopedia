/** Where e-mail notification subscriptions live (JCE-069): D1 in production, memory in tests. */

export type MailKind = "results" | "corrections";
export const MAIL_KINDS: readonly MailKind[] = ["results", "corrections"];

export type MailRecipient = { id: string; email: string; stopKey: string; kinds: MailKind[]; companyId: string };

export interface MailStore {
  create(row: { id: string; stopKey: string; confirmId: string; email: string; kinds: MailKind[]; companies: string[]; now: string }): Promise<void>;
  /** True when a pending subscription was confirmed by this token. */
  confirm(confirmId: string, now: string): Promise<boolean>;
  /** "pending" until the mailed link is opened; null when there is no such subscription (stopped, expired). */
  state(id: string): Promise<"pending" | "on" | null>;
  /** Replaces the companies; false when the subscription no longer exists. */
  update(id: string, companies: string[], now: string): Promise<boolean>;
  remove(id: string): Promise<void>;
  removeByStopKey(stopKey: string): Promise<boolean>;
  /** Confirmed subscriptions following any of these companies, one row per (subscription, company). */
  recipients(companyIds: string[]): Promise<MailRecipient[]>;
  seen(keys: string[]): Promise<Set<string>>;
  markSeen(keys: string[], now: string): Promise<void>;
  isEmptySeen(): Promise<boolean>;
  /** `${subscriptionId}|${eventKey}` for every event already mailed to that subscription. */
  delivered(keys: string[]): Promise<Set<string>>;
  markDelivered(pairs: [string, string][]): Promise<void>;
  /** Forgets who got an event once everyone has, and the event is recorded as seen. */
  clearDelivered(keys: string[]): Promise<void>;
  /** Unconfirmed sign-ups older than the confirmation window, and announcements older than the update window. */
  prune(unconfirmedBefore: string, seenBefore: string): Promise<void>;
}

type D1Like = {
  prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown>; all<T>(): Promise<{ results: T[] }>; first<T>(): Promise<T | null> } };
  batch(statements: unknown[]): Promise<unknown>;
};

const chunks = <T>(items: T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));
const parseKinds = (text: string): MailKind[] => text.split(",").filter((k): k is MailKind => (MAIL_KINDS as string[]).includes(k));

export function d1MailStore(db: D1Like): MailStore {
  const follows = (id: string, companies: string[]) => [
    db.prepare("DELETE FROM mail_follows WHERE subscription_id = ?").bind(id),
    ...companies.map((c) => db.prepare("INSERT OR IGNORE INTO mail_follows (subscription_id, company_id) VALUES (?, ?)").bind(id, c)),
  ];
  return {
    async create(r) {
      await db.batch([
        db.prepare("INSERT INTO mail_subscriptions (id, stop_key, confirm_id, email, kinds, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(r.id, r.stopKey, r.confirmId, r.email, r.kinds.join(","), r.now, r.now),
        ...follows(r.id, r.companies),
      ]);
    },
    async confirm(confirmId, now) {
      const row = await db.prepare("UPDATE mail_subscriptions SET confirm_id = NULL, confirmed_at = ?, updated_at = ? WHERE confirm_id = ? RETURNING id").bind(now, now, confirmId).first<{ id: string }>();
      return row !== null;
    },
    async state(id) {
      const row = await db.prepare("SELECT confirmed_at FROM mail_subscriptions WHERE id = ?").bind(id).first<{ confirmed_at: string | null }>();
      return row ? (row.confirmed_at ? "on" : "pending") : null;
    },
    async update(id, companies, now) {
      const row = await db.prepare("UPDATE mail_subscriptions SET updated_at = ? WHERE id = ? RETURNING id").bind(now, id).first<{ id: string }>();
      if (!row) return false;
      await db.batch(follows(id, companies));
      return true;
    },
    async remove(id) {
      await db.batch([
        db.prepare("DELETE FROM mail_follows WHERE subscription_id = ?").bind(id),
        db.prepare("DELETE FROM mail_delivered WHERE subscription_id = ?").bind(id),
        db.prepare("DELETE FROM mail_subscriptions WHERE id = ?").bind(id),
      ]);
    },
    async removeByStopKey(stopKey) {
      const row = await db.prepare("SELECT id FROM mail_subscriptions WHERE stop_key = ?").bind(stopKey).first<{ id: string }>();
      if (!row) return false;
      await this.remove(row.id);
      return true;
    },
    async recipients(companyIds) {
      const out: MailRecipient[] = [];
      for (const group of chunks(companyIds, 50)) {
        const { results } = await db
          .prepare(
            `SELECT s.id, s.email, s.stop_key, s.kinds, f.company_id FROM mail_follows f JOIN mail_subscriptions s ON s.id = f.subscription_id WHERE s.confirmed_at IS NOT NULL AND f.company_id IN (${group.map(() => "?").join(",")})`,
          )
          .bind(...group)
          .all<{ id: string; email: string; stop_key: string; kinds: string; company_id: string }>();
        for (const r of results) out.push({ id: r.id, email: r.email, stopKey: r.stop_key, kinds: parseKinds(r.kinds), companyId: r.company_id });
      }
      return out;
    },
    async seen(keys) {
      const found = new Set<string>();
      for (const group of chunks(keys, 50)) {
        const { results } = await db.prepare(`SELECT key FROM mail_seen WHERE key IN (${group.map(() => "?").join(",")})`).bind(...group).all<{ key: string }>();
        for (const r of results) found.add(r.key);
      }
      return found;
    },
    async markSeen(keys, now) {
      for (const group of chunks(keys, 50)) await db.batch(group.map((k) => db.prepare("INSERT OR IGNORE INTO mail_seen (key, seen_at) VALUES (?, ?)").bind(k, now)));
    },
    async isEmptySeen() {
      return (await db.prepare("SELECT key FROM mail_seen LIMIT 1").bind().first()) === null;
    },
    async delivered(keys) {
      const found = new Set<string>();
      for (const group of chunks(keys, 50)) {
        const { results } = await db
          .prepare(`SELECT subscription_id, key FROM mail_delivered WHERE key IN (${group.map(() => "?").join(",")})`)
          .bind(...group)
          .all<{ subscription_id: string; key: string }>();
        for (const r of results) found.add(`${r.subscription_id}|${r.key}`);
      }
      return found;
    },
    async markDelivered(pairs) {
      for (const group of chunks(pairs, 50)) await db.batch(group.map(([id, key]) => db.prepare("INSERT OR IGNORE INTO mail_delivered (subscription_id, key) VALUES (?, ?)").bind(id, key)));
    },
    async clearDelivered(keys) {
      for (const group of chunks(keys, 50)) await db.batch(group.map((k) => db.prepare("DELETE FROM mail_delivered WHERE key = ?").bind(k)));
    },
    async prune(unconfirmedBefore, seenBefore) {
      await db.batch([
        db.prepare("DELETE FROM mail_follows WHERE subscription_id IN (SELECT id FROM mail_subscriptions WHERE confirmed_at IS NULL AND created_at < ?)").bind(unconfirmedBefore),
        db.prepare("DELETE FROM mail_subscriptions WHERE confirmed_at IS NULL AND created_at < ?").bind(unconfirmedBefore),
        db.prepare("DELETE FROM mail_seen WHERE seen_at < ? AND key != '__bootstrap__'").bind(seenBefore),
      ]);
    },
  };
}

type MemoryRow = { stopKey: string; confirmId: string | null; email: string; kinds: MailKind[]; companies: Set<string>; createdAt: string; confirmedAt: string | null };

/** The same contract in memory, for tests. */
export function memoryMailStore() {
  const rows = new Map<string, MemoryRow>();
  const seenKeys = new Map<string, string>();
  const deliveredPairs = new Set<string>();
  const store: MailStore & { rows: typeof rows; seenKeys: typeof seenKeys; deliveredPairs: typeof deliveredPairs } = {
    rows,
    seenKeys,
    deliveredPairs,
    async create(r) {
      rows.set(r.id, { stopKey: r.stopKey, confirmId: r.confirmId, email: r.email, kinds: r.kinds, companies: new Set(r.companies), createdAt: r.now, confirmedAt: null });
    },
    async confirm(confirmId, now) {
      for (const row of rows.values())
        if (row.confirmId === confirmId) {
          row.confirmId = null;
          row.confirmedAt = now;
          return true;
        }
      return false;
    },
    async state(id) {
      const row = rows.get(id);
      return row ? (row.confirmedAt ? "on" : "pending") : null;
    },
    async update(id, companies) {
      const row = rows.get(id);
      if (!row) return false;
      row.companies = new Set(companies);
      return true;
    },
    async remove(id) {
      rows.delete(id);
      for (const p of deliveredPairs) if (p.startsWith(`${id}|`)) deliveredPairs.delete(p);
    },
    async removeByStopKey(stopKey) {
      for (const [id, row] of rows)
        if (row.stopKey === stopKey) {
          await store.remove(id);
          return true;
        }
      return false;
    },
    async recipients(companyIds) {
      const want = new Set(companyIds);
      return [...rows]
        .filter(([, r]) => r.confirmedAt)
        .flatMap(([id, r]) => [...r.companies].filter((c) => want.has(c)).map((companyId) => ({ id, email: r.email, stopKey: r.stopKey, kinds: r.kinds, companyId })));
    },
    async seen(keys) {
      return new Set(keys.filter((k) => seenKeys.has(k)));
    },
    async markSeen(keys, now) {
      for (const k of keys) if (!seenKeys.has(k)) seenKeys.set(k, now);
    },
    async isEmptySeen() {
      return seenKeys.size === 0;
    },
    async delivered(keys) {
      const want = new Set(keys);
      return new Set([...deliveredPairs].filter((p) => want.has(p.slice(p.indexOf("|") + 1))));
    },
    async markDelivered(pairs) {
      for (const [id, key] of pairs) deliveredPairs.add(`${id}|${key}`);
    },
    async clearDelivered(keys) {
      const gone = new Set(keys);
      for (const p of deliveredPairs) if (gone.has(p.slice(p.indexOf("|") + 1))) deliveredPairs.delete(p);
    },
    async prune(unconfirmedBefore, seenBefore) {
      for (const [id, r] of rows) if (!r.confirmedAt && r.createdAt < unconfirmedBefore) rows.delete(id);
      for (const [k, at] of seenKeys) if (at < seenBefore && k !== "__bootstrap__") seenKeys.delete(k);
    },
  };
  return store;
}
