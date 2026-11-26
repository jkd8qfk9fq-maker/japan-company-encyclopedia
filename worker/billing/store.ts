/** Where billing entitlements live (JCE-100): D1 in production, memory in tests. */

export type Entitlement = {
  code: string;
  customerId: string | null;
  email: string | null;
  status: string;
  /** When the current paid period ends, ms since the epoch. */
  paidUntil: number;
  /** "stripe" from a webhook, "beta-manual" when the operator recorded a 学習β grant by hand. */
  source: string;
  /** The Stripe product the subscription belongs to (JCE-133); null when no event has carried one yet. */
  productId: string | null;
  /** The Stripe price the subscription is on (JCE-133); null when no event has carried one yet. */
  priceId: string | null;
};

export interface BillingStore {
  get(code: string): Promise<Entitlement | null>;
  upsert(row: Entitlement & { now: string }): Promise<void>;
  /** True the first time an event id is recorded; false when Stripe redelivers it. */
  markEvent(id: string, type: string, now: string): Promise<boolean>;
}

type D1Like = {
  prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown>; first<T>(): Promise<T | null> } };
};

type EntitlementRow = {
  code: string;
  customer_id: string | null;
  email: string | null;
  status: string;
  paid_until: number;
  source: string;
  product_id: string | null;
  price_id: string | null;
};

const fromRow = (r: EntitlementRow): Entitlement => ({
  code: r.code,
  customerId: r.customer_id,
  email: r.email,
  status: r.status,
  paidUntil: r.paid_until,
  source: r.source,
  productId: r.product_id,
  priceId: r.price_id,
});

export function d1BillingStore(db: D1Like): BillingStore {
  return {
    async get(code) {
      const row = await db
        .prepare("SELECT code, customer_id, email, status, paid_until, source, product_id, price_id FROM entitlements WHERE code = ?")
        .bind(code)
        .first<EntitlementRow>();
      return row ? fromRow(row) : null;
    },
    async upsert(r) {
      // A field the new event does not carry (an invoice knows the e-mail, a subscription update may not)
      // must not erase what an earlier event recorded.
      await db
        .prepare(
          `INSERT INTO entitlements (code, customer_id, email, status, paid_until, source, product_id, price_id, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(code) DO UPDATE SET
             customer_id = COALESCE(excluded.customer_id, entitlements.customer_id),
             email = COALESCE(excluded.email, entitlements.email),
             status = excluded.status,
             paid_until = excluded.paid_until,
             source = excluded.source,
             product_id = COALESCE(excluded.product_id, entitlements.product_id),
             price_id = COALESCE(excluded.price_id, entitlements.price_id),
             updated_at = excluded.updated_at`,
        )
        .bind(r.code, r.customerId, r.email, r.status, r.paidUntil, r.source, r.productId, r.priceId, r.now, r.now)
        .run();
    },
    async markEvent(id, type, now) {
      try {
        await db.prepare("INSERT INTO billing_events (id, type, received_at) VALUES (?, ?, ?)").bind(id, type, now).run();
        return true;
      } catch {
        return false; // the primary key already holds this event: a redelivery
      }
    },
  };
}

/** The same contract in memory, for tests. */
export function memoryBillingStore() {
  const rows = new Map<string, Entitlement>();
  const events = new Set<string>();
  const store: BillingStore & { rows: typeof rows; events: typeof events } = {
    rows,
    events,
    async get(code) {
      return rows.get(code) ?? null;
    },
    async upsert(r) {
      const prev = rows.get(r.code);
      rows.set(r.code, {
        code: r.code,
        customerId: r.customerId ?? prev?.customerId ?? null,
        email: r.email ?? prev?.email ?? null,
        status: r.status,
        paidUntil: r.paidUntil,
        source: r.source,
        productId: r.productId ?? prev?.productId ?? null,
        priceId: r.priceId ?? prev?.priceId ?? null,
      });
    },
    async markEvent(id) {
      if (events.has(id)) return false;
      events.add(id);
      return true;
    },
  };
  return store;
}
