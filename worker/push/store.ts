import type { StoredSubscription } from "./webpush";

/** Where subscriptions live (JCE-059): D1 in production, memory in tests. */
export interface PushStore {
  upsert(id: string, subscription: StoredSubscription, companies: string[], now: string): Promise<void>;
  remove(id: string): Promise<void>;
  followers(companyIds: string[]): Promise<{ id: string; subscription: StoredSubscription; companyId: string }[]>;
  seen(keys: string[]): Promise<Set<string>>;
  markSeen(keys: string[], now: string): Promise<void>;
  isEmptySeen(): Promise<boolean>;
  /** Housekeeping: idle subscriptions and announcements older than the update window. */
  prune(subscriptionsBefore: string, seenBefore: string): Promise<void>;
}

export async function subscriptionId(endpoint: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint)));
  return [...digest].map((b) => b.toString(16).padStart(2, "0")).join("");
}

type D1Like = {
  prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown>; all<T>(): Promise<{ results: T[] }>; first<T>(): Promise<T | null> } };
  batch(statements: unknown[]): Promise<unknown>;
};

const chunks = <T>(items: T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));

export function d1Store(db: D1Like): PushStore {
  return {
    async upsert(id, s, companies, now) {
      await db.batch([
        db.prepare("INSERT INTO push_subscriptions (id, endpoint, p256dh, auth, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth, updated_at = excluded.updated_at").bind(id, s.endpoint, s.p256dh, s.auth, now),
        db.prepare("DELETE FROM push_follows WHERE subscription_id = ?").bind(id),
        ...companies.map((c) => db.prepare("INSERT OR IGNORE INTO push_follows (subscription_id, company_id) VALUES (?, ?)").bind(id, c)),
      ]);
    },
    async remove(id) {
      await db.batch([db.prepare("DELETE FROM push_follows WHERE subscription_id = ?").bind(id), db.prepare("DELETE FROM push_subscriptions WHERE id = ?").bind(id)]);
    },
    async followers(companyIds) {
      const out: { id: string; subscription: StoredSubscription; companyId: string }[] = [];
      for (const group of chunks(companyIds, 50)) {
        const marks = group.map(() => "?").join(",");
        const { results } = await db
          .prepare(`SELECT s.id, s.endpoint, s.p256dh, s.auth, f.company_id FROM push_follows f JOIN push_subscriptions s ON s.id = f.subscription_id WHERE f.company_id IN (${marks})`)
          .bind(...group)
          .all<{ id: string; endpoint: string; p256dh: string; auth: string; company_id: string }>();
        for (const r of results) out.push({ id: r.id, subscription: { endpoint: r.endpoint, p256dh: r.p256dh, auth: r.auth }, companyId: r.company_id });
      }
      return out;
    },
    async seen(keys) {
      const found = new Set<string>();
      for (const group of chunks(keys, 50)) {
        const { results } = await db.prepare(`SELECT key FROM push_seen WHERE key IN (${group.map(() => "?").join(",")})`).bind(...group).all<{ key: string }>();
        for (const r of results) found.add(r.key);
      }
      return found;
    },
    async markSeen(keys, now) {
      for (const group of chunks(keys, 50)) await db.batch(group.map((k) => db.prepare("INSERT OR IGNORE INTO push_seen (key, seen_at) VALUES (?, ?)").bind(k, now)));
    },
    async isEmptySeen() {
      return (await db.prepare("SELECT key FROM push_seen LIMIT 1").bind().first()) === null;
    },
    async prune(subscriptionsBefore, seenBefore) {
      await db.batch([
        db.prepare("DELETE FROM push_follows WHERE subscription_id IN (SELECT id FROM push_subscriptions WHERE updated_at < ?)").bind(subscriptionsBefore),
        db.prepare("DELETE FROM push_subscriptions WHERE updated_at < ?").bind(subscriptionsBefore),
        db.prepare("DELETE FROM push_seen WHERE seen_at < ? AND key != '__bootstrap__'").bind(seenBefore),
      ]);
    },
  };
}

/** The same contract in memory, for tests. */
export function memoryStore() {
  const subs = new Map<string, { subscription: StoredSubscription; companies: Set<string>; updatedAt: string }>();
  const seenKeys = new Map<string, string>();
  const store: PushStore & { subs: typeof subs; seenKeys: typeof seenKeys } = {
    subs,
    seenKeys,
    async upsert(id, subscription, companies, now) {
      subs.set(id, { subscription, companies: new Set(companies), updatedAt: now });
    },
    async remove(id) {
      subs.delete(id);
    },
    async followers(companyIds) {
      const want = new Set(companyIds);
      return [...subs].flatMap(([id, s]) => [...s.companies].filter((c) => want.has(c)).map((companyId) => ({ id, subscription: s.subscription, companyId })));
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
    async prune(subscriptionsBefore, seenBefore) {
      for (const [id, s] of subs) if (s.updatedAt < subscriptionsBefore) subs.delete(id);
      for (const [k, at] of seenKeys) if (at < seenBefore && k !== "__bootstrap__") seenKeys.delete(k);
    },
  };
  return store;
}
